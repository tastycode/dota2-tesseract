import Box from '@material-ui/core/Box'
import Fab from '@material-ui/core/Fab';
import SnackBar from '@material-ui/core/Snackbar'
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper'
import { JSONToHTMLTable } from '@kevincobain2000/json-to-html-table'


import AddIcon from '@material-ui/icons/Search';
import LaunchIcon from '@material-ui/icons/Launch'
import CopyIcon from '@material-ui/icons/AssignmentTurnedIn'
import copy from 'copy-to-clipboard'
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import jsonQuery from 'json-query'
import {uniqBy, prop, omit} from 'ramda'

import { media } from '../../styles/styles';
import Button from '@material-ui/core/Button';
import {sprintf} from 'sprintf-js'

// tslint:disable-next-line:no-var-requires
const itemData = require('../itemdata.json') as {[key: string]: any}
const dotaItems = Object.keys(itemData).map( key => {
  return {
    key,
    ...itemData[key],
    ...itemData[key].attributes.reduce((o: any,i: any) => {
          o[i.name] = i.value[0]
          return o       
    }, {})
  }
}).filter( (item: any) => item.description ).map( (item: any) => {
      let description 
      try {
        let sprintableDescription = item.description.replaceAll('%%%', '%&37;').replaceAll(/%([a-z_]+)%/g, '%($1)s')
        description = sprintf(sprintableDescription, item).replaceAll('&37;', '%').replaceAll('\\n', "<br/>")
      } catch (e) {
        description = item.description
      }
      return {
        ...item,
        description
      }
    }
)

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  max-width: 900px;
  margin: 10px;
`;

const Column = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
  width: 100%;
  ${media.tablet`
      flex-direction: column;
  `};
`;
const Row = styled.div`
  align-items: center;
  display: flex;
  flex-grow: 1;
  justify-content: center;
  max-width: 900px;
  width: 100%;
`;
const Spacer = styled.div`
  height: 50px;
`;

const ItemContent = styled(Box)`
`

const HomePageContainer: React.FC = () => {
  // Component State
  const [searchText, setSearchText] = React.useState<string>('');
  const [error, setError] = React.useState(false);
  const [showHelp, setShowHelp] = React.useState(false)
  const handleChange = (e: any) => {
    if (error) {
      setError(false);
    }
    setSearchText(e.target.value);
  };

  // Redux
  const [items, setItems] =  React.useState<any[]>(dotaItems)
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(-1)
  const [snackOpen, setSnackOpen] = React.useState(false)

  const handleKeyPressed = (event: React.KeyboardEvent) => {
    const currentItem = items[selectedItemIndex] as any
    if (event.key === 'Enter') {
        if (selectedItemIndex === -1) {
            handleSearch()
        } else {
            copyItem(currentItem)
        }
      handleSearch();
    } else if (event.key === 'ArrowRight' && selectedItemIndex !== -1) {
      openItem(currentItem)
        
    }else if (event.key === 'ArrowDown') {
        const nextIndex = selectedItemIndex + 1;
        if (items[nextIndex]) {
            setSelectedItemIndex(nextIndex);
            (document.getElementById((items[nextIndex] as any).name) as any).scrollIntoView()
        }
    } else if (event.key === 'ArrowUp') {
        const nextIndex = selectedItemIndex - 1
        if (items[nextIndex]) {
            setSelectedItemIndex(nextIndex)
            if (nextIndex > -1) {
              (document.getElementById((items[nextIndex] as any).name) as any).scrollIntoView()
            } else {
              (document.getElementById('search') as any).scrollIntoView()
                window.location.hash = `#search`
            }
        }
      }
  };
  const handleSearch = () => {
    setSelectedItemIndex(-1)
    if (searchText.length === 0) {
      return setError(true);
    }
    //simple search
    const searchableKeys = Object.keys(dotaItems[0]).filter( (key: string) => {
      return typeof(dotaItems[0][key]) === 'string'
    })
    const simpleMatches = dotaItems.filter((dotaItem: any) => {
        const rex = new RegExp(`${searchText}`, 'i')
        return searchableKeys.find((key: string) => {
          return rex.test(dotaItem[key])
        })
    })

    // advanced search
    const matches = jsonQuery(`items[*${searchText}]`, {
      data: {items: dotaItems},
      locals: {
        contains: (input: any, query: string) => {
          const rex = new RegExp(query, 'i')
          const result = searchableKeys.find((key: string) => {
            return rex.test(input[key])
          })
          return result
        }
      }
  })
    const foundItems = uniqBy(prop('id'), [...simpleMatches, ...matches.value])
    setItems(foundItems)

  };

  const copyItem = (item: any) => {
      copy(item.displayname)
      setSnackOpen(true)
  }

  const openItem = (item: any) => {
    window.open(`https://liquipedia.net/dota2/${item.displayname}`)
  }

  return (
    <>
     <SnackBar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={snackOpen}
        autoHideDuration={6000}
        onClose={() => setSnackOpen(false)}
        message={selectedItemIndex > -1 ? `Copied "${(items[selectedItemIndex] as any).name}"` : 'Item copied'}
      />

      <Column>
        <Row>
          <TextField
     
              autoFocus
            error={error}
            onKeyDown={handleKeyPressed}
            helperText={error ? 'Please Include Some text.' : ''}
            fullWidth
            id="searchText"
            label="Search Items..."
            margin="normal"
            onChange={handleChange}
            value={searchText}
          />
          <Fab
            href={'#'}
            size={'small'}
            onClick={handleSearch}
            color="secondary"
            aria-label="Search"
          >
            <AddIcon />
          </Fab>
        </Row>
        <Row>
      <Button
      variant="contained"
      color="primary"
      size="small"
      style={{margin: '0.25em'}}
      onClick={() => setShowHelp(!showHelp)}
      >
        Help
      </Button>
      <Dialog onClose={() => setShowHelp(!showHelp)} open={showHelp}>
        <DialogTitle id="simple-dialog-title">Search Syntax</DialogTitle>

          <b>Simple Search</b>
          <table>
            <tr>
              <td><pre>boots</pre></td><td></td>
            </tr>
            <tr>
              <td><pre>strong dispel</pre></td><td></td>
            </tr>
            <tr>
              <td><pre>silence</pre></td><td></td>
            </tr>
          </table>
          <b>Advanced Search</b>
          <table>
            <tr>
            <td><pre>:contains(boots) & itemcost &lt; 960</pre></td><td>Items mentioning boots which cost less than 960 goldjj</td>
            </tr>
            <tr>
              <td><pre>:contains(mana) & :contains(consumable)</pre></td><td>Consumable mana items</td>
            </tr>
            <tr>
              <td><pre>bonus_movement_speed &gt; 20</pre></td><td>Items that grant more than 20 movement speed</td>
            </tr>
            <tr>
              <td><pre>ItemInitialCharges &gt; 1</pre></td><td>All items with multiple charges</td>
            </tr>
          </table>
          <b>Usage</b>
          <ul>
          <li>
            Use this with the option "Shop Search Gets Focus on open" in advanced options
            </li>
            <li>make sure you already have a hotkey to open your shop </li>
            <li>Alt+Tab to this website and the search should already be focused</li>
            <li>Press enter to search</li>
            <li>Use the up and down arrow keys to jump between results</li>
            <li>Hit enter to copy the item name onto the clipboard</li>
            <li>Tap the right arrow to open up a wiki page for the item</li>
          </ul>
      </Dialog>

        </Row>
        <Row>
          <Column>
          <Paper>

          </Paper>
          </Column>

        </Row>
      </Column>
      <Spacer />
      <Column>
        {items.map((item: any, i) => (
        <Row>
            <Wrapper>
              <div style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'row'}}>

                      <Typography
        align={'left'}
        color={i === selectedItemIndex ? 'secondary': 'textPrimary'}
        style={{backgroundColor: i === selectedItemIndex ? '#fff' : 'transparent'}}
        variant={'h5'}
        gutterBottom
      >
      <a id={item.name as string}
                      tabIndex={i+2}
                      onClick={() => copyItem(item)}
                      >
          {item.displayname}
      </a>

      </Typography>
      <div>
      <Button
      variant="contained"
      color="secondary"
      size="small"
      style={{margin: '0.25em'}}
      startIcon={<LaunchIcon/>}
      onClick={() => openItem(item)}
      >
          Open
      </Button>
      <Button
      variant="contained"
      color="default"
      style={{margin: '0.25em'}}
      size="small"
      startIcon={<CopyIcon/>}
      onClick={() => copyItem(item)}
      >
          Copy
      </Button>

      </div>
              </div>
      <ItemContent>
        {item.description && <div dangerouslySetInnerHTML={{__html: item.description.replaceAll("h1>", "h3>")}}/>}
        <JSONToHTMLTable data={omit(['id', 'description', 'attributes', 'level', 'manacost', 'name', 'displayname', 'ItemAliases'], item)}/>
      </ItemContent>


                <Spacer/>
            </Wrapper>
        </Row>
        ))}
        <Row/>
        <Row>
          <Column>
          <Paper>
            Made by <a href='github.com/tastycode'>@tastycode</a>
            <br/>
            Data from https://devilesk.com/dota2/items
          </Paper>
          </Column>
        </Row>
      </Column>


    </>
  );
};

export default HomePageContainer;

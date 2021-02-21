import Box from '@material-ui/core/Box'
import Fab from '@material-ui/core/Fab';
import SnackBar from '@material-ui/core/Snackbar'
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton'
import { spacing } from '@material-ui/system';

import AddIcon from '@material-ui/icons/Search';
import LaunchIcon from '@material-ui/icons/Launch'
import CopyIcon from '@material-ui/icons/AssignmentTurnedIn'
import copy from 'copy-to-clipboard'
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { media } from '../../styles/styles';
import { addTodoThunk } from '../redux/todo/slice';
import SingleTodoContainer from './SingleTodoContainer';
import Button from '@material-ui/core/Button';

// tslint:disable-next-line:no-var-requires
const dotaItems = require('../items.json')
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
    max-height: 10em;
    overflow: scroll;
`

const HomePageContainer: React.FC = () => {
  // Component State
  const [searchText, setSearchText] = React.useState<string>('');
  const [error, setError] = React.useState(false);
  const handleChange = (e: any) => {
    if (error) {
      setError(false);
    }
    setSearchText(e.target.value);
  };

  // Redux
  const dispatch = useDispatch();
  const [items, setItems] =  React.useState([])
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
    const matches = dotaItems.filter((dotaItem: any) => {
        const rex = new RegExp(`${searchText}`, 'i')
        const textLimit = dotaItem.html.indexOf('Version History')
        return rex.test(dotaItem.name) || rex.test(dotaItem.html.slice(0, textLimit))
    })
    setItems(matches)
  };

  const copyItem = (item: any) => {
      copy(item.name)
      setSnackOpen(true)
  }

  const openItem = (item: any) => {
    window.open(`https://liquipedia.net/dota2/${item.name}`)
  }


  const processedHtml = (itemHtml: string) => {
      let html =  itemHtml.replaceAll("/commons/images/", "//liquipedia.net/commons/images/")
      html = html.replaceAll('/dota2/', 'https://liquidpedia.net/dota2/')
      return html
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
          {item.name}
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
      <ItemContent dangerouslySetInnerHTML={{__html: processedHtml(item.html)}}/>

                <Spacer/>
            </Wrapper>
        </Row>
        ))}
        <Row/>
      </Column>
    </>
  );
};

export default HomePageContainer;

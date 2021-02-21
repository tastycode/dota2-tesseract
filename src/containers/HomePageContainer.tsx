import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
import SnackBar from '@material-ui/core/Snackbar'
import Box from '@material-ui/core/Box'
import AddIcon from '@material-ui/icons/Search';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import copy from 'copy-to-clipboard'

import { media } from '../../styles/styles';
import { addTodoThunk } from '../redux/todo/slice';
import SingleTodoContainer from './SingleTodoContainer';
const dotaItems = require('../items.json')
const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  max-width: 900px;
  margin: 10px;
  align-items: center;
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
  const handleItemKeyPressed = (event) => {
      console.log('item press', event.key)
      if (event.key === 'Enter') {
        //const el = document.getElementById(item.name)
        //console.log(el)
      }
  }
  const handleKeyPressed = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
        if (selectedItemIndex == -1) {
            handleSearch()
        } else {
            copyItem(items[selectedItemIndex])
        }
      handleSearch();
    } else if (event.key === 'ArrowRight' && selectedItemIndex !== -1) {
        window.open(`https://liquipedia.net/dota2/${items[selectedItemIndex].name}`)
        
    }else if (event.key === 'ArrowDown') {
        let nextIndex = selectedItemIndex + 1
        if (items[nextIndex]) {
            setSelectedItemIndex(nextIndex)
            document.querySelector(`a[name="${items[nextIndex].name}"]`).scrollIntoView()
        }
    } else if (event.key === 'ArrowUp') {
        const nextIndex = selectedItemIndex - 1
        if (items[nextIndex]) {
            setSelectedItemIndex(nextIndex)
            if (nextIndex > -1) {
                document.querySelector(`a[name="${items[nextIndex].name}"]`).scrollIntoView()
            } else {
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
    const matches = dotaItems.filter((dotaItem) => {
        const rex = new RegExp(`${searchText}`, 'i')
        const textLimit = dotaItem.html.indexOf('Version History')
        return rex.test(dotaItem.name) || rex.test(dotaItem.html.slice(0, textLimit))
    })
    setItems(matches)
  };

  const copyItem = (item) => {
      copy(item.name)
      setSnackOpen(true)
  }


  const processedHtml = (itemHtml) => {
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
        message={selectedItemIndex > -1 ? `Copied "${items[selectedItemIndex].name}"` : 'Item copied'}
      />

      <Column>
        <Row>
        <a name='search'></a>
          <TextField
          tabindex="0"
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
            tabindex="1"
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
        {items.map((item, i) => (
        <Row>
            <Wrapper>
                      <Typography
        align={'left'}
        color={i == selectedItemIndex ? 'secondary': 'textPrimary'}
        style={{backgroundColor: i === selectedItemIndex ? '#fff' : 'transparent'}}
        variant={'h5'}
        gutterBottom
      >
      <a name={item.name}
                      tabIndex={i+2}
                      onClick={() => copyItem(item)}
                      >
          {item.name}
      </a>
      </Typography>
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

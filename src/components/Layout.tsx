import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import AboutIcon from '@material-ui/icons/Help';
import MenuIcon from '@material-ui/icons/Menu';
import Head from 'next/head';
import Link from 'next/link';
import * as React from 'react';
import styled from 'styled-components';

import { notify } from '../lib/notify';
import GithubIcon from './icons/GithubIcon';

const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  margin-bottom: 35px;
  flex-direction: column;
`;
const Spacer = styled.div`
  height: 50px;
`;

const Layout: React.FC = ({ children }) => {
  const handleMenuButtonClick = () => {
    notify('Also comes with SweetAlert');
  };

  return (
    <Wrapper>
      <Head>
        <title>Dota2 Items Tesseract</title>
      </Head>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            href={'#'}
            onClick={handleMenuButtonClick}
            color="inherit"
            aria-label="Menu"
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" color="inherit">
            <div style={{ paddingLeft: 20 }}>
              <Link href={'/'}>
                <a>Dota2 Items Tesseract</a>
              </Link>
            </div>
          </Typography>

          <div style={{ flexGrow: 1 }} />

        </Toolbar>
      </AppBar>
      <Spacer />
      {children}
      <Spacer />
    </Wrapper>
  );
};

export default Layout;

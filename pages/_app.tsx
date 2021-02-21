import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import Head from 'next/head';
import * as React from 'react';
import { useStore } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { wrapper } from '../src/store';
import { SweetAlertSyle } from '../styles/GlobalStyles';
import { theme } from '../styles/styles';

const App = wrapper.withRedux(({ Component, pageProps }: any) => {
  const store = useStore();
  return (
    <PersistGate
      persistor={(store as any).__persistor} // This is pretty hacky but recommended by next-redux-wrapper
      loading={<div>Loading</div>}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SweetAlertSyle />
        <Head>
          <title>Next-Smrt</title>
          <meta
            name="viewport"
            content={
              'user-scalable=0, initial-scale=1, ' +
              'minimum-scale=1, width=device-width, height=device-height'
            }
          />
<link rel="stylesheet" href="//liquipedia.net/dota2/load.php?debug=false&amp;lang=en&amp;modules=ext.TeamLiquidIntegration.liquipedia-custom-icons%7Cext.brackets.Bracket.styles%7Cext.bugtracker%2Cliquigoals%2Cliquipediaads%7Cext.flaggedRevs.basic%7Cext.networknotice.Notice%7Cext.wikimenu.wikicolors%7Cfontawesome-pro%7Cmediawiki.legacy.commonPrint%2Cshared%7Cmediawiki.sectionAnchor%7Cmediawiki.skinning.interface%7Cskins.bruinen.theme.dota2&amp;only=styles&amp;skin=bruinen"/>
<link rel="stylesheet" href="//liquipedia.net/dota2/load.php?debug=false&amp;lang=en&amp;modules=ext.smw.style%7Cext.smw.tooltip.styles&amp;only=styles&amp;skin=bruinen"/>
<link rel="stylesheet" href="//liquipedia.net/dota2/load.php?debug=false&amp;lang=en&amp;modules=ext.srf.styles&amp;only=styles&amp;skin=bruinen"/>
<link rel="stylesheet" href="//liquipedia.net/commons/load.php?debug=false&amp;articles=Variables.css%7CAmbox.css%7CBracket.css%7CColours.css%7CCrosstable.css%7CDivTable.css%7CFilterButtons.css%7CGrid.css%7CIcons.css%7CInfobox.css%7CMainpage.css%7CMatchseries.css%7CMiscellaneous.css%7CNavFrame.css%7CNavbox.css%7CPanels.css%7CPrizepooltable.css%7CQuote.css%7CSelectall.css%7CStatisticstable.css%7CSwisstable.css%7CTables.css%7CTabs.css%7CTeamTemplates.css%7CTeamcard.css%7CTechtree.css&amp;only=styles&amp;mode=articles&amp;cacheversion=39&amp;*"/>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&amp;family=Droid+Sans+Mono&amp;family=Source+Code+Pro:wght@400;700&amp;display=swap"/>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@500&amp;display=swap&amp;text=adeilpqu"/>
        </Head>
        <Component {...pageProps} />
      </ThemeProvider>
    </PersistGate>
  );
});

export default App;

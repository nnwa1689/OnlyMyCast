import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Home from './Component/Home/Home'
import Account from './Component/Account/Account'
import Player from './Component/Player/Player'
import Navbar from './Component/NavBar/Navbar';
import PodcastAccount from './Component/Account/PodcastAccount';
import Subreq from './Component/Account/Subreq';
import Search from './Component/Search/Search'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import PodcastHome from './Component/Podcast/PodcastHome';
import NewPodcast from './Component/Podcast/NewPodcast'

const App = () => {
  var basename = "/";
  document.body.style.backgroundColor = "#f7f7f7"
  const theme = createMuiTheme({
    palette: {
    primary: {
        main: "#ff9800",
    },
    secondary: {
        main: "#ff3d00",
    },
    white:{
        main: "#00000"
    }
    },
  });

  const [playerUrl, setPlayerUrl] = useState();
  const [playerTitle, setPlayerTitle] = useState();
  const [podcastName, setPodcastName] = useState();
  const [coverUri, setCoverUri] = useState();

  const setPlayer = (e) => {
    console.log(e.currentTarget.dataset.titlename);
    setPlayerTitle(e.currentTarget.dataset.titlename)
    setPlayerUrl(e.currentTarget.dataset.uri)
    setPodcastName(e.currentTarget.dataset.podcastname)
    setCoverUri(e.currentTarget.dataset.coveruri)
  }
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <BrowserRouter basename={ basename }>
          <Player url={playerUrl} podcastName={podcastName} singleName={playerTitle} coverUrl={coverUri}>
              <Navbar></Navbar>
              <Route exact path="/" component={Home} />
              <Route exact path="/account" component={Account} />
              <Route exact path="/podcastaccount" component={PodcastAccount} />
              <Route exact path="/subreq" component={Subreq} />
              <Route exact path="/search" component={Search} />
              <Route path="/search/:q" component={Search} />
              <Route path="/podcast/:id"
                 render={(props) => (
                    <PodcastHome {...props} setPlayer={setPlayer} />
                  )} />
              <Route exact path="/uploadpodcast" component={NewPodcast} />
            </Player>
        </BrowserRouter> 
      </div>
    </ThemeProvider>

  );
}
export default App;

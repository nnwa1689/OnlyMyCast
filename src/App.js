import logo from './logo.svg';
import './App.css';
import { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
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
import PodcastDetails from './Component/Podcast/PodcastDetails'
import EditPodcast from './Component/Podcast/EditPodcast'
import EditPodcastDetails from './Component/Podcast/EditPodcastDetails';
import SignIn from './Component/SignIn/SignIn';
import SignUp from './Component/SignUp/SignUp';
/*UI*/
import LinearProgress from '@material-ui/core/LinearProgress';
import FirebaseConfig from './FirebaseConfig/FirebaseConfig';

const App = () => {

  const isFirstLoad = useRef(true);
  const [isAuth, setAuth] = useState(0);
  const [playerUrl, setPlayerUrl] = useState();
  const [playerTitle, setPlayerTitle] = useState("");
  const [podcastName, setPodcastName] = useState("");
  const [coverUri, setCoverUri] = useState("");
  const [userData, setUserData] = useState();
  const [userUpdate, setUserUpdate] = useState(0);

  var basename = "/";
  if (!firebase.apps.length) {
    firebase.initializeApp(FirebaseConfig);  
  }

  if (process.env.NODE_ENV !== "development") {
    if (isFirstLoad.current) {
      //const appCheck = firebase.appCheck();
      //appCheck.activate('6Lfs9TQbAAAAANxrKWGaZgx71yy6PHZ26t5CGE4h');
    }
    basename = "/apps/one-sen-day/"
  }

  document.body.style.backgroundColor = "#f7f7f7";

  const handleUserUpdate = ()=>{
    setUserUpdate(userUpdate + 1);
    console.log(userUpdate);
  }

  useEffect(
    () => {
      firebase.auth().onAuthStateChanged((user)=>{
        if (user) {
          firebase.firestore().collection("user").doc(user.uid).get()
          .then(
            (doc)=>{
              setUserData(doc.data());
              setAuth(true);
            }
          );
        } else {
          setAuth(false);
        }
      });
    },[userUpdate]
  )

  const setPlayer = (e) => {
    console.log(e.currentTarget.dataset.titlename);
    setPlayerTitle(e.currentTarget.dataset.titlename)
    setPlayerUrl(e.currentTarget.dataset.uri)
    setPodcastName(e.currentTarget.dataset.podcastname)
    setCoverUri(e.currentTarget.dataset.coveruri)
  }

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

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <BrowserRouter basename={ basename }>
          <Player url={playerUrl} podcastName={podcastName} singleName={playerTitle} coverUrl={coverUri}>
            { isAuth !== 0 ? 
                <>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/account"
                    render={(props) => (
                        <Account {...props} user={userData} dataupdate={handleUserUpdate} />
                      )}
                  />
                  <Route exact path="/podcastaccount" component={PodcastAccount} />
                  <Route exact path="/subreq" component={Subreq} />
                  <Route exact path="/search" component={Search} />
                  <Route path="/search/:q" component={Search} />
                  <Route path="/podcast/:id"
                    render={(props) => (
                        <PodcastHome {...props} setPlayer={setPlayer} />
                      )} />
                  <Route path="/podcastdetail/:id"                  
                    render={(props) => (
                        <PodcastDetails {...props} setPlayer={setPlayer} />
                      )} />
                  <Route exact path="/uploadpodcast" component={NewPodcast} />
                  <Route exact path="/editpodcast" component={EditPodcast} />
                  <Route path="/editpodcast/:id" component={EditPodcastDetails} />
                  <Route path="/editpodcast/:id" component={EditPodcastDetails} />
                  <Route exact path="/signin" component={SignIn} />
                  <Route exact path="/signup" component={SignUp} />
                  { isAuth ? "" : <Redirect to='/signin'/> }
                  { isAuth && <Navbar user={userData}></Navbar> }
                </>
                :
                <LinearProgress style={{ wdith: 100 }}/>
                }

          </Player>
        </BrowserRouter> 
      </div>
    </ThemeProvider>

  );
}
export default App;

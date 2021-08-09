//react
import './App.css';
import { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
//firebase
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/messaging";
import FirebaseConfig from './FirebaseConfig/FirebaseConfig';
//component
import AdsenseComponent from './Component/Adsense/AdsenseComponent';
import Home from './Component/Home/Home'
import Account from './Component/Account/Account'
import Player from './Component/Player/Player'
import Navbar from './Component/NavBar/Navbar';
import PodcastAccount from './Component/Account/PodcastAccount';
import Subreq from './Component/Account/Subreq';
import Search from './Component/Search/Search'
import PodcastHome from './Component/Podcast/PodcastHome';
import NewPodcast from './Component/Podcast/NewPodcast'
import PodcastDetails from './Component/Podcast/PodcastDetails'
import EditPodcast from './Component/Podcast/EditPodcast'
import EditPodcastDetails from './Component/Podcast/EditPodcastDetails';
import SignIn from './Component/SignIn/SignIn';
import SignUp from './Component/SignUp/SignUp';
import UnloginNavBar from './Component/NavBar/UnloginNavbar';
import FansAdmin from './Component/Account/FansAdmin';
import ForgetPassword from './Component/Account/ForgetPassword';
import EmbedChannel from './Component/Podcast/EmbedChannel';
/*GoogleUI*/
import LinearProgress from '@material-ui/core/LinearProgress';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
//Other
import Cookies from 'universal-cookie';


const App = (props) => {
  const allowUnloginPath = ['podcast', 'embed'];
  const removeNavbarPath = ['embed'];
  const removeAdsensePath = ['embed'];
  const [isAuth, setAuth] = useState(0);
  const [playerUrl, setPlayerUrl] = useState();
  const [playerTitle, setPlayerTitle] = useState("");
  const [podcastName, setPodcastName] = useState("");
  const [coverUri, setCoverUri] = useState("");
  const [userData, setUserData] = useState("");
  const [userUpdate, setUserUpdate] = useState(0);
  const [pathname, setPathname] = useState();
  const [inApp, setInApp] = useState(false);
  const userUid = useRef("");
  const userEmail = useRef("");
  const isFirstLoading = useRef(true);


  if (!firebase.apps.length) {
    firebase.initializeApp(FirebaseConfig);  
  }

  //開發環境
  var basename = "/";
  var basenameIndex = 1;
  var fcmVapidKey = 'BBPvT3efBxPguqWhRsn349AGlOkCa5KoGECtVQqOrcAMgDUKEZebLORp5v_KJ6kgVsWGqLvu-TqVG8wTgDA34RY';

  if (process.env.NODE_ENV !== "development") {
    //產品環境
    basename = "/webapp/";
    basenameIndex = 2;
    fcmVapidKey = 'BF1eW1y0DHQl40_Vz1IPqvxKRlOiSr98s2ZlUWDdHT6-VPxMIPXPrWxtCii4g8cdEBSMX37YB1suR85fGjtxpHI';
  } else {
    if (!(firebase.messaging.isSupported())) {
      console.log('This browser does not support notification');
    } else {
      // 僅在本機測試環境啟用，如產品環境使用 src/service-worker.js 提供 FCM 功能
      const swUrl = `${process.env.PUBLIC_URL}/firebase-messaging-sw.js`;
      navigator.serviceWorker
      .register(swUrl);
    }
  }

  const isInApp = () => {
    var useragent = navigator.userAgent || navigator.vendor || window.opera;
    return (useragent.indexOf("FBAN") > -1) || (useragent.indexOf("FBAV") > -1) || (useragent.indexOf("Instagram") > -1) || (useragent.indexOf("Line") > -1);
  }

  const handleUserUpdate = ()=>{
    setUserUpdate(userUpdate + 1);
  }

  useEffect(
    () => {
      firebase.auth().onAuthStateChanged(async(user)=>{
        if (user) {
          //notification webbrowser
          if (!(firebase.messaging.isSupported())) {
            console.log('This browser does not support notification');
          } else {
            const messaging = firebase.messaging();
            const registration = await navigator.serviceWorker.ready;
            messaging.getToken(
              { 
                serviceWorkerRegistration: registration,
                vapidKey: fcmVapidKey 
              })
              .then((currentToken) => {
                if (currentToken) {
                  //update token to user
                  firebase.firestore().collection("user")
                  .doc(user.uid)
                  .collection("pushNotificationToken")
                  .doc(currentToken)
                  .set({ token: currentToken, updateTime: firebase.firestore.FieldValue.serverTimestamp() })
                  .then(
                    () => {
                      console.log("You can got notification.")
                    }
                  );
                } else {
                  // Show permission request UI
                  console.log('No registration token available. Request permission to generate one.');
                }
            }).catch((err) => {
                console.log('An error occurred while retrieving token.');
            });
          }

          firebase.firestore().collection("user").doc(user.uid).get()
          .then(
            (doc)=>{
              setUserData(doc.data());
              userUid.current = user.uid;
              userEmail.current = user.email;
              setAuth(true);
            }
          );          
        } else {
          setAuth(false);
        }
      });
    },[userUpdate]
  )

  useEffect(
    ()=>{
      if (isFirstLoading.current === true) {
        document.body.style.backgroundColor = "#f7f7f7";
        setPathname(window.location.pathname.split('/')[basenameIndex]);
        setInApp(isInApp());
        console.log("Client Version:0809-3")
        isFirstLoading.current = false;
      }
    }
  )


  const setPlayer = (e) => {
    setPlayerTitle(e.currentTarget.dataset.titlename)
    setPlayerUrl(e.currentTarget.dataset.uri)
    setPodcastName(e.currentTarget.dataset.podcastname)
    setCoverUri(e.currentTarget.dataset.coveruri)
  }

  const theme = createMuiTheme({
    palette: {
      primary: {
          main: "#FD3E49",
      },
      secondary: {
          main: "#363636",
      },
    },
    typography: {
      fontFamily: 'NotoSansTC-Regular',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <BrowserRouter basename={ basename }>
          <Player url={playerUrl} podcastName={podcastName} singleName={playerTitle} coverUrl={coverUri}>
            { inApp===true ? <Typography variant="h6" component="span"><br/><br/>您可能正在使用APP內置的瀏覽器，如果要體驗完整功能，請透過手機的瀏覽器(Chrome、Safari...etc.)開啟</Typography> : ""}
            { isAuth !== 0 ?  
                <>
                  <Route exact path="/" 
                    render={(props) => (
                        <Home {...props} user={userData} userUid={userUid.current} />
                      )}/>
                  <Route exact path="/account"
                    render={(props) => (
                        <Account {...props} user={userData} dataupdate={handleUserUpdate} userUid={userUid.current} />
                      )}
                  />
                  <Route exact path="/podcastaccount" 
                    render={(props) => (
                        <PodcastAccount {...props} user={userData} userUid={userUid.current}/>
                      )}/>
                  <Route exact path="/fansadmin"
                    render={(props) => (
                        <FansAdmin {...props} user={userData} userUid={userUid.current} />
                      )} />
                  <Route exact path="/subreq" 
                    render={(props) => (
                        <Subreq {...props} user={userData} userUid={userUid.current}/>
                      )} />
                  <Route exact path="/search" component={Search} />
                  <Route path="/search/:q" component={Search} />
                  <Route path="/podcastdetail/:id/:podId"                  
                    render={(props) => (
                        <PodcastDetails {...props} setPlayer={setPlayer} userUid={userUid.current} user={userData} />
                      )} />
                  <Route path="/podcast/:id"
                    render={(props) => (
                        <PodcastHome {...props} setPlayer={setPlayer} user={userData} userUid={userUid.current} />
                      )} />
                  <Route exact path="/uploadpodcast"
                    render={(props) => (
                        <NewPodcast {...props} user={userData} userUid={userUid.current} />
                      )} />
                  <Route exact path="/editpodcasts" 
                    render={(props) => (
                        <EditPodcast {...props} user={userData} />
                      )} 
                  />
                  <Route path="/editpodcast/:id/:podId" 
                    render={(props) => (
                        <EditPodcastDetails {...props} user={userData} />
                      )} 
                  />
                  <Route path="/embed/:id" 
                    render={(props) => (
                        <EmbedChannel {...props} user={userData} />
                      )} 
                  />
                  <Route exact path="/signin" component={SignIn} />
                  <Route exact path="/signup" component={SignUp} />
                  <Route exact path="/forgetpassword" component={ForgetPassword} />
                  { /* 如果頁面是廣播首頁則允許沒有登入預覽 */
                    !isAuth && (!allowUnloginPath.includes(pathname)) && <Redirect to='/signin'/>
                  }
                  { !isAuth && pathname ==="podcast" && <UnloginNavBar></UnloginNavBar>}
                  { isAuth && (!removeNavbarPath.includes(pathname)) && <Navbar user={userData} userEmail={userEmail.current}></Navbar> }
                  
                  {/*Google Adsense*/}
                  { !(removeAdsensePath.includes(pathname)) && <AdsenseComponent/>}
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

//react
import './App.css';
import { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

//redux
import { useSelector } from 'react-redux';

//sso
import { createUserInfoWithSSO,isWithSSO } from './Functions/SSO';

//firebase
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/messaging";
import FirebaseConfig from './FirebaseConfig/FirebaseConfig';
//DevMode
import FirebaseConfigDev from './FirebaseConfig/FirebaseConfig-dev';
import { fcmVapidKey_prod, fcmVapidKey_dev } from './FirebaseConfig/FcmVapidKey';

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
import AnalyticsPodcastDetails from './Component/Podcast/AnalyticsPodcastDetails';
import NewPodcast from './Component/Podcast/NewPodcast';
import PodcastDetails from './Component/Podcast/PodcastDetails';
import EditPodcast from './Component/Podcast/EditPodcast';
import EditCastDarft from './Component/Podcast/EditCastDarft';
import EditPodcastDetails from './Component/Podcast/EditPodcastDetails';
import SignIn from './Component/SignIn/SignIn';
import SignUp from './Component/SignUp/SignUp';
import UnloginNavBar from './Component/NavBar/UnloginNavbar';
import FansAdmin from './Component/Account/FansAdmin';
import ForgetPassword from './Component/Account/ForgetPassword';
import EmbedChannel from './Component/Podcast/EmbedChannel';
import EmailVerified from './Component/Account/EmailVerified';
import Onelink from './Component/Podcast/Onelink';
import NotFound from './Component/Home/NotFound';
import OnlyMySound from './Component/Podcast/OnlyMySound';
import PlayOnlyMySound from './Component/Podcast/PlayOnlyMySound';

/*GoogleUI*/
import LinearProgress from '@material-ui/core/LinearProgress';
import { createMuiTheme, makeStyles, ThemeProvider, useTheme } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Footer from './Component/NavBar/Footer';

/* function */
import GetRssfeed from './Functions/GetRssfeed';

const clientversion = "V231016.11";

const App = (props) => {
  //常用設定
  const allowUnloginPath = ['podcast', 'embed', 'signup', 'signin', 'podcastdetail', 'onelink'];
  const removeNavbarPath = ['embed', 'emailverified', 'signin', 'signup', 'forgetpassword', 'onelink'];
  const usingUnloginNavbarPath = ['podcast', 'podcastdetail']
  const removeAdsensePath = ['embed', 'signin', 'signup'];
  const onlyLightModePath = ['onelink'];
  const [isAuth, setAuth] = useState(0);
  const [playerUrl, setPlayerUrl] = useState();
  const [playerTitle, setPlayerTitle] = useState("");
  const [podcastName, setPodcastName] = useState("");
  const [coverUri, setCoverUri] = useState("");
  const [userData, setUserData] = useState("");
  const [userUpdate, setUserUpdate] = useState(0);
  const [pathname, setPathname] = useState();
  const [inApp, setInApp] = useState(false);
  const [emailVeri, setEmailVeri] = useState(true);
  const userUid = useRef("");
  const userEmail = useRef("");
  const withGoogleSingin = useRef("");
  const isFirstLoading = useRef(true);
  
  if (!firebase.apps.length) {
    if (process.env.NODE_ENV !== "development") {
      firebase.initializeApp(FirebaseConfig);
    } else {
      firebase.initializeApp(FirebaseConfigDev);
    }
  }

  //開發環境
  var basename = "/";
  var basenameIndex = 1;
  var fcmVapidKey = fcmVapidKey_dev;
  var baseWwwUrl = "http://localhost:3000/";
  var socketUrl = "https://onlymycast.com:8080/";

  if (process.env.NODE_ENV !== "development") {
    //產品環境
    basename = "/";
    basenameIndex = 1;
    fcmVapidKey = fcmVapidKey_prod;
    baseWwwUrl = "https://app.onlymycast.com/";
  } else {
    if (!(firebase.messaging.isSupported())) {
      console.log('This browser does not support notification');
    } else {
      // 僅在本機測試環境啟用，如產品環境使用 src/service-worker.js 提供 FCM 功能
      const swUrl = `${process.env.PUBLIC_URL}/firebase-messaging-sw.js`;
      navigator.serviceWorker.register(swUrl);
    }
  }

  const isInApp = () => {
    var useragent = navigator.userAgent || navigator.vendor || window.opera;
    return (useragent.indexOf("FBAN") > -1) || (useragent.indexOf("FBAV") > -1) || (useragent.indexOf("Instagram") > -1) || (useragent.indexOf("Line") > -1);
  }

  const handleUserUpdate = () => {
    setUserUpdate(userUpdate + 1);
  }

  useEffect(
    () => {
      firebase.auth().onAuthStateChanged(async(user) => {
        if (user) {
          withGoogleSingin.current = firebase.auth().currentUser.providerData[0].providerId == 'google.com' ? true : false;
          //檢查 Token，如果 email 驗證結果沒有更新，就重新取得 token。
          user.getIdTokenResult().then(
            (idToken) => {
              if (idToken.claims.email_verified !== user.emailVerified) {
                user.getIdToken(true);
              }
            }
          );

          //checkEmailVerified 僅限產品環境
          if (!user.emailVerified && process.env.NODE_ENV !== "development") {
            //unVerified, 轉跳到驗證介面
            setAuth(true);
            setEmailVeri(false);
            userUid.current = user.uid;
            userEmail.current = user.email;
          } else {
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

            //取得 user 資料
            firebase.firestore().collection("user").doc(user.uid).get()
              .then(
                (doc) => {
                  //如果 user 資訊不存在，應該是SSO登入但沒有資料，建立一個
                  if (!doc.exists && isWithSSO(user)) {
                    createUserInfoWithSSO(user)
                    .then(
                      () => { window.location.reload(); }
                    );
                  } else {
                    setUserData(doc.data());
                    userUid.current = user.uid;
                    userEmail.current = user.email;
                    setAuth(true);
                  }

                }
              );
          }
        } else {
          setAuth(false);
        }
      });
    }, [userUpdate]
  )

  useEffect(
    () => {
      if (isFirstLoading.current === true) {
        //document.body.style.backgroundColor = "#f7f7f7";
        setInApp(isInApp());
        isFirstLoading.current = false;
      }
    }
  )

  useEffect(
    () => {
      setPathname(window.location.pathname.split('/')[basenameIndex]);
    }
  )

  //Player
  const setPlayer = async (e) => {

    if (isAuth) {
      //recoding play history this user
      firebase.firestore().collection("podcast")
      .doc(e.currentTarget.dataset.poduserid)
      .collection('podcast')
      .doc(e.currentTarget.value)
      .collection('playedlist')
      .doc(userUid.current)
      .set(userData)
      .then(
        () => {
          //pass
        }
      )
      .catch(
        (e) => {
          console.log("e");
        }
      );
    }

    //set player
    setPlayerTitle(e.currentTarget.dataset.titlename);
    setPlayerUrl(e.currentTarget.dataset.uri);
    setPodcastName(e.currentTarget.dataset.podcastname);
    setCoverUri(e.currentTarget.dataset.coveruri);
  }

  //darkmode
  const darkTheme = createMuiTheme({
    palette: {
      type:'dark',
      background:{
        default: 'rgb(24, 24, 24)',
      },
      primary: {
        main: "#FD3E49",
      },
      secondary: {
        main: "#363636",
      },
    },
    typography: {
      fontFamily: 'NotoSansTC-Medium',
    },
    overrides: {
      MuiPaper: {
        root: {
          backgroundColor: "#000000",
        },
      },
      MuiCircularProgress: {
        root: {
          display: "block",
          marginLeft : "auto",
          marginRight : "auto"
        }
      },
      MuiTypography:
      {
        root: {
          marginBottom: "0.25rem",
          marginTop: "0.25rem"
        }
      },
      MuiCard:
      {
        root: {
          boxShadow: "none",
          borderRadius: "8px",
          borderStyle:"solid",
          borderColor:"rgb(100, 100, 100)",
          border:"1px",
        }
      },
      MuiAppBar: {
        colorDefault: {
          backgroundColor:'transparent',
        },
        colorPrimary:{
          backgroundColor: "rgba(0, 0, 0, 1)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
          //backdropFilter: "blur(4px)",
          boxShadow: "none",
          color: "#FFFFFF"
        }
      },
      MuiButton: {
        root: {
          height: "54px",
        },
        contained: {
          boxShadow: "none",
          '&:hover': {
            boxShadow: "none",
          },
          '&:focus': {
            boxShadow: "none",
          },
          '&:active': {
            boxShadow: "none",
          },
        },
      }
    }
  });

  //lightMode
  const lightTheme = createMuiTheme({
    palette: {
      type:'light',
      background:{
        default: '#F1EEE9',
      },
      primary: {
        main: "#FD3E49",
      },
      secondary: {
        main: "#363636",
      },
    },
    typography: {
      fontFamily: 'NotoSansTC-Medium',
    },
    overrides: {
      MuiTooltip: {
        tooltip: {
          borderRadius: 0,
          border: "1px solid #000",
          backgroundColor: "#FFF",
          color: "#000",
          boxShadow: "2px 2px 0 0 #000",
          fontSize: "0.75rem"
        }
      },
      MuiPaper:{
        elevation6:{
          boxShadow: "none",
        }
      },
      MuiCircularProgress: {
        root: {
          display: "block",
          marginLeft: "auto",
          marginRight: "auto"
        }
      },
      MuiTypography:
      {
        root: {
          marginBottom: "0.25rem",
          marginTop: "0.25rem"
        }
      },
      MuiDialog: {
        paper: {
          border: "1px solid #000",
          boxShadow: "4px 4px 0px 0px #000",
          borderRadius: "0px"
        }
      },
      MuiCard:
      {
        root: {
          //boxShadow: "0 2px 8px 0 rgba(145, 158, 171, 0.2)",
          boxShadow: "none",
          borderRadius: "0px",
          borderStyle:"solid",
          borderColor:"rgb(220, 220, 220)",
          border:"1px",
        }
      },
      MuiTab: {
        root: {
          transition: "all 0.3s",
          border: "1px solid transparent",
          margin: "4px",
          '&:hover': {
            border: "1px solid #000",
            backgroundColor: "#FFF"
          },
        }
      },
      MuiAlert: {
        root: {
          borderRadius: "0px"
        }
      },
      MuiDivider: {
        root: {
          backgroundColor: "#000"
        }
      },
      MuiDrawer: {
        paper: {
          backgroundColor: "#F1EEE9"
        },
        paperAnchorDockedLeft: {
          borderRight: "1px solid #000"
        }
      },
      MuiAppBar: {
        colorDefault: {
          backgroundColor:'transparent',
        },
        colorPrimary:{
          backgroundColor: "#F1EEE9",
          borderBottom: "1px solid #000",
          //backdropFilter: "blur(4px)",
          boxShadow: "none",
          color: "#363636"
        }
      },
      MuiMenu: {
        paper: {
          borderRadius: "0px",
          boxShadow: "4px 4px 0px 0px #000",
          border: "1px solid #000"
        }
      },
      MuiIconButton: {
        root: {
          transition: "all 0.3s",
          boxShadow: "none",
          transform: "translate(0px, 0px)",
          '&:hover': {
            boxShadow: " 4px 4px 0px 0px #000",
            transform: "translate(-4px, -4px)",
          },
          '&:focus': {

          },
          '&:active': {
            boxShadow: "none",
            transform: "translate(0px, 0px)"
          },
        }
      },
      MuiFab: {
        root: {
          transition: "all 0.3s",
          boxShadow: "none",
          transform: "translate(0px, 0px)",
          '&:hover': {
            boxShadow: " 4px 4px 0px 0px #000",
            transform: "translate(-4px, -4px)",
          },
          '&:focus': {

          },
          '&:active': {
            boxShadow: "none",
            transform: "translate(0px, 0px)"
          },
        }
      },
      MuiOutlinedInput: {
        notchedOutline: {
          borderColor: "#000",
          borderWidth: "1px",
          borderRadius: "0px",
        }
      },
      MuiSnackbarContent: {
        root: {
          borderRadius: "0px"
        }
      },
      MuiButton: {
        root: {
          transition: "all 0.3s",
          height: "64px",
          border: "1px solid #000",
          borderRadius: "0px",
        },
        outlinedPrimary: {
          border: "1px solid #FD3E49",
        },
        outlined: {
          border: "1px solid #000",
          '&:hover': {
            border: "1px solid #FD3E49",
            boxShadow: " 4px 4px 0px 0px #FD3E49",
            transform: "translate(-4px, -4px)",
          },
          '&:focus': {

          },
          '&:active': {
            boxShadow: "none",
            transform: "translate(0px, 0px)"
          },
        },
        text: {
          '&:hover': {
            border: "1px solid #FD3E49",
            boxShadow: " 4px 4px 0px 0px #FD3E49",
            transform: "translate(-4px, -4px)",
          },
          '&:focus': {

          },
          '&:active': {
            boxShadow: "none",
            transform: "translate(0px, 0px)"
          },
        },
        contained: {
          boxShadow: "none",
          '&:hover': {
            boxShadow: " 4px 4px 0px 0px #000",
            transform: "translate(-4px, -4px)",
          },
          '&:focus': {

          },
          '&:active': {
            boxShadow: "none",
            transform: "translate(0px, 0px)"
          },
        },
      }
    }
  });

  const theme = useTheme();
  const useStyles = makeStyles(
    (theme) => (
      {
        content: {
          [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${200}px)`,
            marginLeft: 200,
          },
        }
      }
    )
  );
  const classes = useStyles();

  return (
    <ThemeProvider theme={ 
      useSelector(state => state.mode) === 'light' || onlyLightModePath.includes(pathname) ? lightTheme : darkTheme
    }>
      { /*如果是oneLink 就不載入黑暗模式*/ }
      <CssBaseline />
      <div className="App">
        <BrowserRouter basename={basename}>
          <Player url={playerUrl} podcastName={podcastName} singleName={playerTitle} coverUrl={coverUri} isAuth={isAuth} />
            {inApp === true &&
              <Container maxWidth="lg">
                <MuiAlert style={{ marginTop: "100px", marginBottom: "-50px" }} elevation={6} variant="filled" severity="warning">
                  您可能正在使用APP內置的瀏覽器，如果要體驗完整功能，請透過瀏覽器開啟
                </MuiAlert>
              </Container>
            }

            {isAuth !== 0 ?
              <>
                <Switch>
                  <Route exact path="/"
                    render={(props) => (
                      <main className={ classes.content }>
                        <Home {...props} user={userData} userUid={userUid.current} />
                      </main>
                    )} />
                  <Route exact path="/account"
                    render={(props) => (
                      <main className={ classes.content }>
                        <Account {...props} user={userData} dataupdate={handleUserUpdate} userUid={userUid.current} userEmail={userEmail.current} googleSing={withGoogleSingin.current} />
                      </main>
                    )}
                  />
                  <Route exact path="/podcastaccount"
                    render={(props) => (
                      <main className={ classes.content }>
                        <PodcastAccount {...props} user={userData} userUid={userUid.current} userEmail={userEmail.current} baseWwwUrl={baseWwwUrl}/>
                      </main>
                    )} />
                  <Route exact path="/fansadmin"
                    render={(props) => (
                      <main className={ classes.content }>
                        <FansAdmin {...props} user={userData} userUid={userUid.current} />
                      </main>
                    )} />
                  <Route exact path="/subreq"
                    render={(props) => (
                      <main className={ classes.content }>
                        <Subreq {...props} user={userData} userUid={userUid.current} />
                      </main>
                    )} />
                  <Route exact path="/search" 
                    render={(props) => (
                      <main className={ classes.content }>
                        <Search {...props} />
                      </main>
                      )
                      } />
                  <Route path="/search/:q" 
                    render={(props) => (
                      <main className={ classes.content }>
                        <Search {...props} />
                      </main>
                    )
                      } />
                  <Route path="/podcastdetail/:id/:podId"
                    render={(props) => (
                      <main className={  isAuth && classes.content  }>
                        <PodcastDetails {...props} setPlayer={setPlayer} userUid={userUid.current} user={userData} isAuth={isAuth} baseWwwUrl={baseWwwUrl}/>
                      </main>
                    )} />
                  <Route path="/podcast/:id"
                    render={(props) => (
                      <main className={ isAuth && classes.content }>
                        <PodcastHome {...props} setPlayer={setPlayer} user={userData} userUid={userUid.current} isAuth={isAuth} />
                      </main>
                    )} />
                    

                  <Route path="/livechat/my"
                    render={(props) => (
                      <main className={ isAuth && classes.content }>
                        <OnlyMySound {...props} setPlayer={setPlayer} user={userData} userUid={userUid.current} isAuth={isAuth} socketUrl={socketUrl} />
                      </main>
                    )} />

                  <Route path="/liveroom/"
                    render={(props) => (
                      <main className={ isAuth && classes.content }>
                        <PlayOnlyMySound {...props} setPlayer={setPlayer} user={userData} userUid={userUid.current} isAuth={isAuth} socketUrl={socketUrl} />
                      </main>
                    )} />


                  <Route exact path="/uploadpodcast"
                    render={(props) => (
                      <main className={ classes.content }>
                        <NewPodcast {...props} user={userData} userUid={userUid.current} userEmail={userEmail.current} baseWwwUrl={ baseWwwUrl }/>
                      </main>
                    )} />
                  <Route exact path="/editpodcasts"
                    render={(props) => (
                      <main className={ classes.content }>
                        <EditPodcast {...props} user={userData} />
                      </main>
                    )}
                  />
                  <Route path="/editpodcast/:id/:podId"
                    render={(props) => (
                      <main className={ classes.content }>
                        <EditPodcastDetails {...props} user={userData} userEmail={userEmail.current} baseWwwUrl={ baseWwwUrl }/>
                      </main>
                    )}
                  />
                  <Route path="/editcastdarft/:id/:podId"
                    render={(props) => (
                      <main className={ classes.content }>
                        <EditCastDarft {...props} user={userData} userUid={userUid.current} userEmail={userEmail.current} baseWwwUrl={ baseWwwUrl }/>
                      </main>
                    )}
                  />
                  <Route exact path="/analyticspodcast/:id/:podId"
                    render={(props) => (
                      <main className={ classes.content }>
                        <AnalyticsPodcastDetails {...props} user={userData} />
                      </main>
                    )}
                  />
                  <Route exact path="/embed/:id"
                    render={(props) => (
                      <EmbedChannel {...props} user={userData} baseWwwUrl={baseWwwUrl}/>
                    )}
                  />
                  <Route exact path="/onelink/:id"
                    render={(props) => (
                      <Onelink {...props} user={userData} baseWwwUrl={baseWwwUrl}/>
                    )}
                  />
                  <Route exact path="/signin" component={SignIn} />
                  <Route exact path="/signup" component={SignUp} />
                  <Route exact path="/forgetpassword" component={ForgetPassword} />
                  <Route exact path="/emailverified" component={EmailVerified} />
                  <Route exact path="/rss/:podcastuserid/:uid" render={
                    (props) => {
                      GetRssfeed(props.match.params.podcastuserid, props.match.params.uid);
                    }
                  } />
                  <Route path="/" render={
                    (props) => (
                      <main className={ classes.content }>
                        <NotFound />
                      </main>
                      )}
                   />
                </Switch>
                <main className={ isAuth && classes.content }>
                  {
                  /*Google Adsense*/
                  !(removeAdsensePath.includes(pathname)) && <AdsenseComponent />
                  }
                  {
                    /* 不必移除footer的地方 */
                    (!removeNavbarPath.includes(pathname)) && <Footer/>
                  } 
                </main>          
                {
                  /* 不必移除navbar 而且登入 -> 顯示正常版navbar */
                  (!removeNavbarPath.includes(pathname) && isAuth) && <Navbar ver={clientversion} user={userData} userEmail={userEmail.current}></Navbar>}
                {
                  /* Email 沒有驗證 emailUnVerified*/
                  !emailVeri && <Redirect to='/emailverified' />
                }
                { /* 如果頁面是廣播首頁則允許沒有登入預覽 */
                  !isAuth && (!allowUnloginPath.includes(pathname)) && <Redirect to='/signin' />
                }
                {
                  /*顯示沒有登入版本的 navbar*/
                  !isAuth && (usingUnloginNavbarPath.includes(pathname)) && <UnloginNavBar></UnloginNavBar>
                }

              </>
              :
              <LinearProgress style={{ wdith: 100 }} />
            }
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}
export default App;

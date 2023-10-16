//react
import React, { useState, useEffect, useRef } from 'react'
import MDEditor from '@uiw/react-md-editor';
//ui
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import AttachmentIcon from '@material-ui/icons/Attachment';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import SwipeableViews from 'react-swipeable-views';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import YouTubeIcon from '@material-ui/icons/YouTube';
import TwitterIcon from '@material-ui/icons/Twitter';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@mui/material/Grid';
import InfoIcon from '@material-ui/icons/Info';
import RssFeedIcon from '@material-ui/icons/RssFeed';
//customUI
import TabPanel from '../CustomComponent/TabPanel';
//firebase
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
//other
import { Helmet } from 'react-helmet';
import genrssfeed from '../../Functions/genRssfeed';
import delrssfeed from '../../Functions/delRssfeed';
//media images
import kklogo from '../../static/kkbox_app_icon.png';
import spotiflogo from '../../static/spotify.png';
import applelogo from '../../static/hero_icon__c135x5gz14mu_large_2x.png';
import googlelogo from '../../static/icons8-google-podcasts-48.png';
import soundonlogo from '../../static/soundon.png';
import omclogo from '../../static/logo192.png';
import { Divider } from '@material-ui/core';


const useStyles = makeStyles((theme)=>({
    root: {
        marginTop: 100,
        alignItems:"center",
    },
    appBar: {
      top: 'auto',
      bottom: 0,
      alignItems:"center",
    },
    paper: {
        padding: "16px",
        height: "220px",
    },
    large: {
        width: theme.spacing(32),
        height: theme.spacing(32),
        marginBottom: theme.spacing(3),
        marginTop:theme.spacing(3),
        color: "#FFFFFF",
        backgroundColor: "#FD3E49",
        marginLeft:"auto",
        marginRight:"auto"
    },
    menuButton: {
      margin: theme.spacing(1),
    },
    marginInput: {
        margin: theme.spacing(2),
        width: "25rem",
      },
    fullWidthInput: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    input: {
        display: 'none',
      },
    tabBar: {
        marginBottom: 10,
        boxShadow : "none",
    },
    facebookColor: {
        color: "#4267B2",
    },
    instagramColor: {
        color: "#C13584",
    },
    youtubeColor: {
        color: "#FF0000",
    },
    twitterColor: {
        color: "#1DA1F2",
    },
    appleColor: {
        color: "#872EC4"
    },
    googleColor: {
        color: "#1565C0"
    },
    spotifyColor: {
        color: "#1DB954"
    },
    kkColor: {
        color: "#09CEF6"
    },
    soundonColor: {
        color: "rgb(26, 171, 225)"
    },
    flexLeft: {
        marginRight: "auto",
    },
    flexRight: {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: theme.spacing(2)
    },
  }));
  
  
const PodcastAccount = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const [pageLoaded, setPageLoaded] = useState(false);
    const [name, setName] = useState();
    const [avatar,setAvatar] = useState();
    const [intro, setIntro] = useState();
    const [preUrl, setPreUrl] = useState("");
    const [userId, setUserId] = useState(props.user.userId);
    const [filename, setFilename] = useState("");
    const [fileBit, setFileBit] = useState();
    const [handleCode, setHandleCode] = useState('init');
    const [uid, setUid] = useState();
    const [category, setCategory] = useState("");
    const [categoryErr, setCategoryErr] = useState(false);
    const [publicStatu, setPublicStatu] = useState(false);
    const [nameErr, setNameErr] = useState(false);
    const [userIdErr, setUserIdErr] = useState(false);
    const [introErr, setIntroErr] = useState(false);
    const [err, setErr] = useState(false);
    const isFirstLoad = useRef(true);
    const [embedCode, setEmbedCode] = useState();
    const [oneLinkUrl, setOneLinkUrl] = useState();
    const [showCopyMsg, setShowCopyMsg] = useState(false);

    const allowCoverFileType = [ 'image/png', 'image/jpeg' ];
    const RssFeedUrl = "https://storage.googleapis.com/onlymycast.appspot.com/" + "rss/" + userId + '/' + uid;

    const categoryListItem = [
        <MenuItem value={"Arts"}>藝術</MenuItem>,
        <MenuItem value={"Business"}>商業與財經</MenuItem>,
        <MenuItem value={"Comedy"}>喜劇</MenuItem>,
        <MenuItem value={"Education"}>教育</MenuItem>,
        <MenuItem value={"Fiction"}>虛構幻想</MenuItem>,
        <MenuItem value={"Government"}>政府與政治</MenuItem>,
        <MenuItem value={"History"}>歷史</MenuItem>,
        <MenuItem value={"Health & Fitness"}>健康與健身</MenuItem>,
        <MenuItem value={"Kids & Family"}>兒童與家庭</MenuItem>,
        <MenuItem value={"Leisure"}>休閒</MenuItem>,
        <MenuItem value={"Music"}>音樂</MenuItem>,
        <MenuItem value={"News"}>新聞</MenuItem>,
        <MenuItem value={"Religion & Spirituality"}>宗教與修行</MenuItem>,
        <MenuItem value={"Science"}>科學</MenuItem>,
        <MenuItem value={"Society & Culture"}>社會與文化</MenuItem>,
        <MenuItem value={"Sports"}>體育競技</MenuItem>,
        <MenuItem value={"Technology"}>科技</MenuItem>,
        <MenuItem value={"True Crime"}>犯罪紀實</MenuItem>,
        <MenuItem value={"TV & Film"}>影集與電影</MenuItem>
    ]

    const [facebookLink, setFacebookLink] = useState();
    const [youtubeLink, setYoutubeLink] = useState ();
    const [instagramLink, setInstargramLink] = useState();
    const [twitterLink, setTwitterLink] = useState();
    const [applepodcastLink, setApplepodcastLink] = useState();
    const [googlepodcastLink, setGooglepodcastLink] = useState();
    const [spotifyLink, setSpotifyLink] = useState();
    const [kkLink, setKkLink] = useState();
    const [soundonLink, setSoundonLink] = useState();

    const [tabValue, setTabValue] = useState(0);

    useEffect(
        ()=>{
            if (isFirstLoad.current) {
                if (props.user.userId !== "") {
                    firebase.firestore().collection("channel").doc(props.user.userId).get()
                    .then(
                      (doc)=>{
                        const data = doc.data();
                        setUid(data.uid);
                        setName(data.name);
                        setIntro(data.intro);
                        setAvatar(data.icon);
                        setFacebookLink(data.facebook === undefined ? "" : data.facebook);
                        setInstargramLink(data.instagram === undefined ? "" : data.instagram);
                        setYoutubeLink(data.youtube === undefined ? "" : data.youtube);
                        setTwitterLink(data.twitter=== undefined ? "" : data.twitter);
                        setApplepodcastLink(data.applepodcast === undefined ? "" : data.applepodcast);
                        setGooglepodcastLink(data.googlepodcast === undefined ? "" : data.googlepodcast);
                        setSpotifyLink(data.spotify === undefined? "" : data.spotify);
                        setKkLink(data.kkLink === undefined ? "" : data.kkLink);
                        setSoundonLink(data.soundonLink === undefined ? "" : data.soundonLink);
                        
                        setPublicStatu(data.publicStatu === undefined ? "false" : data.publicStatu);
                        setEmbedCode(
                           `<iframe iframe frameborder="0" height="200px" style="width:100%;max-width:660px;overflow:hidden;" src="` + props.baseWwwUrl + `embed/` + props.user.userId + `"></iframe>`
                        );
                        setOneLinkUrl(props.baseWwwUrl + 'onelink/' + props.user.userId);
                        setCategory( data.category === undefined ? "" : data.category );
                        setPreUrl( data.preUrl === undefined ? "" : data.preUrl );
                      }
                    );
                } else {
                    setName("");
                    setAvatar("");
                    setIntro("");
                }
                window.scrollTo(0, 0);
                isFirstLoad.current = false;
            }
            setPageLoaded(true);
        }
    );

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
      };
    
    const handleChangeIndex = (index) => {
        setTabValue(index);
    };
    
    const handleCreateChannel = () => {
        setHandleCode('loading');
        setNameErr(false);
        setUserIdErr(false);
        setIntroErr(false);
        if (name==="" || userId==="" || intro==="" || category === "" || !(/^[A-Za-z0-9_.]*$/.test(userId))) {
            if (name==="")
                setNameErr("節目名稱不能為空");
            if (userId==="")
                setUserIdErr("節目ID不能為空");
            if (intro==="")
                setIntroErr("節目簡介不能為空");
            if (!(/^[A-Za-z0-9_.]*$/.test(userId)))
                setUserIdErr("節目 ID 只能輸入英數")
            if (category === "")
                setCategoryErr("請選擇節目分類");
            setHandleCode('error');
            setErr(true);
        } else {
            firebase.firestore().collection("channel").doc(userId).get()
            .then(
              (doc)=>{
                  if (doc.exists) {
                      setHandleCode('error');
                      setUserIdErr("該 ID 已經存在！");
                  } else {
                    //將節目 userId 記錄到使用者資訊
                    firebase.firestore().collection("user").doc(props.userUid).set({
                        userId:userId
                    }, { merge: true }).then(
                        ()=>{
                            //建立節目資訊
                            firebase.firestore().collection("channel").doc(userId).set({
                                name:name,
                                intro:intro,
                                userId: userId,
                                updateTime:firebase.firestore.FieldValue.serverTimestamp(),
                                uid : props.userUid,
                                publicStatu: publicStatu,
                                category : category,
                            }, { merge: true }).then(
                                async()=>{
                                    if (filename !== "") {
                                        var storageRef = firebase.storage().ref().child('/channelIcon/' + userId + "/" + filename);
                                        await storageRef.put(fileBit).then(async(s) => {
                                            await storageRef.getDownloadURL()
                                            .then(async(url) => {
                                                setAvatar(url);
                                                await firebase.firestore().collection("channel").doc(userId).set({
                                                    icon:url
                                                }, { merge: true })
                                            })
                                        });
                                    }
                                    setHandleCode('suc');
                                    setFilename("");
                                    setFileBit();
                                    //rss產生
                                    genrssfeed(userId, props.userEmail, props.baseWwwUrl);
                                }
                            )
                        }
                    )
                  }
              }
            )
        }
    }

    const handleUpdateChannel = () => {
        setHandleCode('loading');
        setNameErr(false);
        setUserIdErr(false);
        setIntroErr(false);
        if (name==="" || userId==="" || intro==="") {
            if (name==="")
                setNameErr("節目名稱不能為空");
            if (userId==="")
                setUserIdErr("節目ID不能為空");
            if (intro==="")
                setIntroErr("節目簡介不能為空");
            setHandleCode('error')
        } else {
            //更新頻道
            firebase.firestore().collection("channel").doc(userId).set({
                name : name,
                intro : intro,
                facebook : facebookLink,
                instagram : instagramLink,
                youtube : youtubeLink,
                twitter : twitterLink,
                applepodcast : applepodcastLink,
                googlepodcast : googlepodcastLink,
                spotify: spotifyLink,
                kkLink: kkLink,
                soundonLink: soundonLink,
                publicStatu: publicStatu,
                category : category,
                preUrl : preUrl,
            }, { merge: true }).then(
                async() => {
                    //如果有新的頭貼
                    if (filename !== "") {
                        var storageRef = firebase.storage().ref().child('/channelIcon/' + userId + "/" + filename);
                        await storageRef.put(fileBit).then(async(s) => {
                            await storageRef.getDownloadURL()
                            .then(async(url) => {
                                setAvatar(url);
                                await firebase.firestore().collection("channel").doc(userId).set({
                                    icon:url
                                }, { merge: true })
                            })
                        });
                    }
                    setHandleCode('suc');
                    setFilename("");
                    setFileBit();
                    //rss產生
                    if ( publicStatu === 'true' ) {
                        genrssfeed(userId, props.userEmail, props.baseWwwUrl);
                    } else {
                    // rss 消滅
                        delrssfeed(userId);
                    }
                }
            )
        }
    }

    const handleCopy = (text)=> {
        navigator.clipboard.writeText(text)
        .then(() => {
            setShowCopyMsg(true);
        }).catch(err => {
        console.log('Something went wrong', err);
        })
    }

    if (name === undefined || intro === undefined){
        return(<CircularProgress style={{marginTop: "25%"}} />);
    } else {
        return(
            <>
            <Helmet>
                <title>節目設定 - Onlymycast</title>
            </Helmet>
            {
                pageLoaded ?
                    <Container maxWidth="lg" className={classes.root}>
                        { props.user.userId === "" ? 
                        <>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={9}>
                                <Typography variant="h3">建立節目</Typography>
                                <Typography variant="body1" component="span">建立屬於您的私人或公開節目</Typography>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    className={classes.button}
                                    onClick={handleCreateChannel}
                                    disabled={handleCode==='loading'|| handleCode==="suc"}
                                    startIcon={ handleCode==='loading'? <CircularProgress size={24} className={classes.buttonProgress} /> : <SaveIcon />}>
                                    建立節目
                                </Button>
                            </Grid>
                        </Grid>
                        <br/>
                        <Divider/>
                        <br/>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <Typography variant="h4">節目封面</Typography>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Avatar variant="rounded" src={avatar} className={classes.large} />
                                <FormControl fullWidth className={classes.fullWidthInput}>
                                    <input
                                        accept="image/jpeg, image/png, image/jpg"
                                        className={classes.input}
                                        id="contained-button-file"
                                        multiple
                                        type="file"
                                        startIcon={<AttachmentIcon />}
                                        disabled={handleCode==='loading'|| handleCode==="suc"}
                                        onChange={(e)=>{
                                            if ( e.target.files.length >= 1 ) {
                                                if ( allowCoverFileType.includes(e.target.files[0].type) ) {
                                                    setAvatar(URL.createObjectURL(e.target.files[0]));
                                                    setFilename(e.target.files[0].name);
                                                    setFileBit(e.target.files[0])
                                                } else {
                                                    setErr("不支援的檔案格式");
                                                }
                                            }
                                        }}
                                    />
                                    <label htmlFor="contained-button-file">
                                        <Button disabled={handleCode==='loading'|| handleCode==="suc"} variant="contained" size="large" fullWidth color="primary" component="span">
                                            <AttachmentIcon />
                                            { filename === "" ? "上傳節目封面" : filename }
                                        </Button>
                                        <FormHelperText>接受.jpeg/.png，若需上架 ApplePodcast 請確認尺寸是正方形且介於 1400*1400 至 3000*3000</FormHelperText>
                                    </label>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br/>
                        <Divider/>
                        <br/>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <Typography variant="h4" component="h1">節目資訊</Typography>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <FormControl fullWidth className={classes.fullWidthInput}>
                                    <TextField 
                                    error={ nameErr!==false } 
                                    helperText={ nameErr !== false && nameErr} 
                                    value={name} 
                                    onChange={(e)=>setName(e.target.value)} 
                                    id="outlined-name"
                                    variant="outlined"
                                    label="節目名稱"
                                    disabled={handleCode==='loading'|| handleCode==="suc"}
                                    required />
                                </FormControl>
                                <FormControl fullWidth className={classes.fullWidthInput}>
                                    <TextField
                                    helperText={"聽眾將透過節目ID搜尋您的節目，建立後不可變更！"} 
                                    value={userId} 
                                    onChange={(e)=>setUserId(e.target.value.replace("/[\W]/g,''"))}
                                    id="outlined-basic" 
                                    label="節目ID" 
                                    variant="outlined"
                                    disabled={handleCode==='loading'|| handleCode==="suc"} 
                                    required
                                    />
                                </FormControl>
                                <FormControl fullWidth variant="outlined" className={classes.formControl}>
                                    <InputLabel>公開狀態</InputLabel>
                                    <Select
                                    value={publicStatu}
                                    onChange={ (e) => { setPublicStatu(e.target.value); } }
                                    label="公開狀態"
                                    fullWidth
                                    >
                                    <MenuItem value={"true"}>公開節目</MenuItem>
                                    <MenuItem value={"false"}>私人節目</MenuItem>
                                    </Select>
                                    <FormHelperText>若為公開，任何人都能收聽並且透過 RSS 上架其他平台；若為私人，只有被允許的人可以收聽且不提供 RSS</FormHelperText>
                                </FormControl>

                                <FormControl fullWidth variant="outlined" className={classes.fullWidthInput}>
                                    <InputLabel>節目分類</InputLabel>
                                    <Select
                                    value={category}
                                    onChange={ (e) => { setCategory(e.target.value);} }
                                    label="節目分類"
                                    fullWidth
                                    >
                                    { categoryListItem.map(item => item) }
                                    </Select>
                                    <FormHelperText>分類會讓其他 Podcast 平台以及聽眾更易於識別節目內容</FormHelperText>
                                </FormControl> 
                            </Grid>
                        </Grid>
                        <br/>
                        <Divider/>
                        <br/>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <Typography variant="h4">節目簡介</Typography>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <FormControl fullWidth className={classes.fullWidthInput}>
                                    <OutlinedInput id="component-outlined" value="falksjd" style={{display:"none"}}/>
                                    <MDEditor
                                        value={intro}
                                        onChange={setIntro}
                                    />                    
                                </FormControl>  
                            </Grid>
                        </Grid>
                        <Snackbar open={handleCode==="suc"} autoHideDuration={3000} onClose={()=>{window.location.reload()}} message="您的節目已經建立"/>
                    </>
                        :
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={9}>
                                        <Typography variant="h3">節目設定</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            onClick={handleUpdateChannel}
                                            disabled={handleCode==="loading"}
                                            startIcon={ handleCode==='loading'? <CircularProgress size={24} className={classes.buttonProgress} /> : <SaveIcon />}>
                                            儲存設定
                                        </Button> 
                                    </Grid>
                                </Grid>
                                <br/>
                                <Divider/>
                                <br/>
                                <AppBar className={classes.tabBar} position="static" color="default">
                                    <Tabs
                                    value={tabValue}
                                    onChange={handleChange}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    variant="fullWidth"
                                    >
                                    <Tab label="節目資訊" />
                                    <Tab label="收聽平台" />
                                    <Tab label="推廣" />
                                    </Tabs>
                                </AppBar>
                                <br/>
                                <SwipeableViews
                                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                                    index={tabValue}
                                    onChangeIndex={handleChangeIndex}>
                                        <TabPanel value={tabValue} index={0}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={4}>
                                                    <Typography variant="h4">節目封面</Typography>
                                                </Grid>
                                                <Grid item xs={12} md={8}>                                                    
                                                    <Avatar variant="rounded" alt={name} src={avatar} className={classes.large} />
                                                    <FormControl fullWidth className={classes.fullWidthInput}>
                                                        <input
                                                            accept="image/jpge, image/jpg, image/png"
                                                            className={classes.input}
                                                            id="contained-button-file"
                                                            multiple
                                                            type="file"
                                                            startIcon={<AttachmentIcon />}
                                                            disabled={handleCode==="loading"}
                                                            onChange={(e)=>{
                                                                if ( e.target.files.length >= 1 ) {
                                                                    if ( allowCoverFileType.includes(e.target.files[0].type) ) {
                                                                        setAvatar(URL.createObjectURL(e.target.files[0]));
                                                                        setFilename(e.target.files[0].name);
                                                                        setFileBit(e.target.files[0])
                                                                    } else {
                                                                        setErr("不支援的檔案格式");
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                        <label htmlFor="contained-button-file">
                                                            <Button disabled={handleCode==="loading"} variant="outlined" size="large" fullWidth color="primary" component="span">
                                                                <AttachmentIcon />
                                                                { filename === "" ? "上傳節目封面" : filename }
                                                            </Button>
                                                            <FormHelperText>接受.jpeg/.png，若需上架 ApplePodcast 請確認尺寸是正方形且介於 1400*1400 至 3000*3000</FormHelperText>
                                                        </label>
                                                    </FormControl> 
                                                </Grid>
                                            </Grid>
                                            <br/>
                                            <Divider/>
                                            <br/>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={4}>
                                                    <Typography variant="h4">節目資訊</Typography>
                                                </Grid>
                                                <Grid item xs={12} md={8}>
                                                    <FormControl fullWidth className={classes.fullWidthInput}>
                                                        <TextField 
                                                            required 
                                                            disabled={handleCode==="loading"} 
                                                            value={name} 
                                                            onChange={(e)=>setName(e.target.value)} 
                                                            id="outlined-basic" 
                                                            label="節目名稱" 
                                                            variant="outlined" />
                                                    </FormControl>

                                                    <FormControl fullWidth className={classes.fullWidthInput}>
                                                        <TextField 
                                                            disabled={handleCode==="loading"} 
                                                            value={preUrl} 
                                                            helperText={ "如使用其他平台追蹤流量，請將前綴輸入此處。若前綴錯誤，將導致節目無法播放！" }
                                                            onChange={(e)=>setPreUrl( e.target.value )} 
                                                            id="outlined-basic" 
                                                            label="播放器前綴" 
                                                            placeholder='https://'
                                                            variant="outlined" />
                                                    </FormControl>

                                                    <FormControl fullWidth variant="outlined" className={classes.fullWidthInput}>
                                                        <InputLabel>公開狀態</InputLabel>
                                                        <Select
                                                        value={publicStatu}
                                                        onChange={ (e) => { setPublicStatu(e.target.value); } }
                                                        label="公開狀態"
                                                        fullWidth
                                                        >
                                                        <MenuItem value={"true"}>公開節目</MenuItem>
                                                        <MenuItem value={"false"}>私人節目</MenuItem>
                                                        </Select>
                                                        <FormHelperText>若為公開，任何人都能收聽並且透過 RSS 上架其他平台；若為私人，只有被允許的人可以收聽且不提供 RSS</FormHelperText>
                                                    </FormControl> 

                                                    <FormControl fullWidth variant="outlined" className={classes.fullWidthInput}>
                                                        <InputLabel>節目分類</InputLabel>
                                                        <Select
                                                        value={category}
                                                        onChange={ (e) => { setCategory(e.target.value);} }
                                                        label="節目分類"
                                                        fullWidth
                                                        >
                                                        { categoryListItem.map(item => item) }
                                                        </Select>
                                                        <FormHelperText>分類會讓其他 Podcast 平台以及聽眾更易於識別節目內容</FormHelperText>
                                                    </FormControl> 
                                                </Grid>
                                            </Grid>
                                            <br/>
                                            <Divider/>
                                            <br/>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={4}>
                                                    <Typography variant="h4">節目簡介</Typography>
                                                </Grid>
                                                <Grid item xs={12} md={8}>
                                                    <FormControl fullWidth className={classes.fullWidthInput}>
                                                    <OutlinedInput id="component-outlined" value="..." style={{display:"none"}}/>
                                                    <MDEditor
                                                        value={intro}
                                                        onChange={setIntro}
                                                    />
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                            
                                        </TabPanel>

                                    <TabPanel value={tabValue} index={1}>
                                        {
                                            publicStatu === 'true' ?
                                            <>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} md={4}>
                                                        <Typography variant="h4"><RssFeedIcon/>RSS Feed</Typography>
                                                    </Grid>
                                                    <Grid item xs={12} md={8}>
                                                        <TextField
                                                            defaultValue={ RssFeedUrl }
                                                            variant="outlined"
                                                            inputProps={
                                                                { readOnly: true, }
                                                            }
                                                            fullWidth
                                                            />

                                                        <Typography variant="body1">
                                                        提交 RSS 讓節目在其他平台被找到。
                                                        </Typography>
                                                        <Button 
                                                            fullWidth
                                                            size="large" 
                                                            color="primary" 
                                                            variant="outlined" 
                                                            onClick={()=>{handleCopy (RssFeedUrl)}}>複製
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                                <br/>
                                                <Divider/>
                                                <br/>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} md={4}>
                                                        <Typography variant="h4"><RssFeedIcon/>收聽平台</Typography>
                                                    </Grid>
                                                    <Grid item xs={12} md={8}>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={6}>
                                                                <Typography variant="h6" color="primary" gutterBottom>
                                                                    <img alt="onlymycast" src= { omclogo } width="24px"/>Onlymycast</Typography>
                                                                <TextField
                                                                    label="onlymycast"
                                                                    defaultValue={ props.baseWwwUrl + "podcast/" + userId}
                                                                    variant="outlined"
                                                                    inputProps={
                                                                        { readOnly: true, }
                                                                    }
                                                                    fullWidth
                                                                    />

                                                                <Typography variant="body1">
                                                                在這裡聽，最棒。
                                                                </Typography>
                                                                <Button 
                                                                    fullWidth
                                                                    size="large" 
                                                                    color="primary" 
                                                                    variant="outlined" 
                                                                    onClick={()=>{handleCopy(props.baseWwwUrl + "podcast/" + userId)}}>複製
                                                                </Button>
                                                            </Grid>
                                                            
                                                            <Grid item xs={12} md={6}>
                                                                <Typography className={classes.appleColor} variant="h6" gutterBottom>
                                                                    <img src={applelogo} width="24px"></img> Apple Podcast
                                                                </Typography>

                                                                <TextField 
                                                                    disabled={handleCode==="loading"} 
                                                                    value={applepodcastLink} 
                                                                    onChange={(e)=>setApplepodcastLink(e.target.value)} 
                                                                    id="apple" 
                                                                    variant="outlined"
                                                                    placeholder="https://" 
                                                                    fullWidth
                                                                />
                                                                <Typography variant="body1">
                                                                    Apple 的 Podcast 播放器，所有 Apple 裝置內建。
                                                                </Typography>
                                                                <Button 
                                                                    fullWidth
                                                                    color="primary" 
                                                                    size="large" 
                                                                    variant="outlined" 
                                                                    target='_blank' 
                                                                    href="https://podcastsconnect.apple.com">
                                                                        申請上架
                                                                </Button>
                                                            </Grid>
                                                            <Grid item xs={12} md={6}>
                                                                <Typography className={classes.googleColor} variant="h6" gutterBottom>
                                                                    <img src={googlelogo} width="24px"></img>Google Podcast</Typography>
                                                                <TextField 
                                                                    disabled={handleCode==="loading"} 
                                                                    value={googlepodcastLink} 
                                                                    onChange={(e)=>setGooglepodcastLink(e.target.value)} 
                                                                    id="twitter" 
                                                                    variant="outlined"
                                                                    placeholder="https://"
                                                                    fullWidth
                                                                />
                                                                <Typography variant="body1">
                                                                    Google 的 Podcast 播放器。
                                                                </Typography>
                                                                <Button 
                                                                    fullWidth
                                                                    color="primary" 
                                                                    size="large" 
                                                                    variant="outlined" 
                                                                    target='_blank' 
                                                                    href="https://podcastsmanager.google.com/add-feed">
                                                                        申請上架
                                                                </Button>           
                                                            </Grid>
                                                            <Grid item xs={12} md={6}>
                                                                <Typography className={classes.spotifyColor} variant="h6" gutterBottom>
                                                                    <img src={spotiflogo} width="24px"></img>Spotify</Typography>
                                                                <TextField 
                                                                    disabled={handleCode==="loading"} 
                                                                    value={spotifyLink}
                                                                    onChange={(e)=>setSpotifyLink(e.target.value)} 
                                                                    id="twitter" 
                                                                    variant="outlined"
                                                                    placeholder="https://" 
                                                                    fullWidth
                                                                />

                                                                <Typography variant="body1">
                                                                    有名的音樂與聲音播放串流平台。
                                                                </Typography>
                                                                <Button 
                                                                    fullWidth
                                                                    color="primary" 
                                                                    size="large" 
                                                                    variant="outlined" 
                                                                    target='_blank' 
                                                                    href="https://podcasters.spotify.com/submit">
                                                                        申請上架
                                                                </Button>
                                                            </Grid>
                                                            <Grid item xs={12} md={6}>
                                                                <Typography className={classes.kkColor} variant="h6" gutterBottom>
                                                                    <img alt="kkbox" src={kklogo} width="24px"></img>KKBOX</Typography>
                                                                <TextField 
                                                                    disabled={handleCode==="loading"} 
                                                                    value={kkLink} 
                                                                    onChange={(e)=>setKkLink(e.target.value)} 
                                                                    id="Kk" 
                                                                    variant="outlined"
                                                                    placeholder="https://"
                                                                    fullWidth
                                                                />
                                                                <Typography variant="body1">
                                                                    亞洲最大的聲音串流平台。
                                                                </Typography>
                                                                <Button
                                                                    fullWidth
                                                                    color="primary" 
                                                                    size="large" 
                                                                    variant="outlined" 
                                                                    target='_blank' 
                                                                    href="https://podcast.kkbox.com/podcasters?lang=tc">
                                                                        申請上架
                                                                </Button>
                                                            </Grid>
                                                            <Grid item xs={12} md={6}>
                                                                <Typography className={classes.soundonColor} variant="h6" gutterBottom>
                                                                    <img alt="kkbox" src={soundonlogo} width="24px"></img>SoundOn</Typography>
                                                                <TextField 
                                                                    disabled={handleCode==="loading"} 
                                                                    value={soundonLink} 
                                                                    onChange={(e)=>setSoundonLink(e.target.value)} 
                                                                    id="Kk" 
                                                                    variant="outlined"
                                                                    placeholder="https://"
                                                                    fullWidth
                                                                />
                                                                <Typography variant="body1">
                                                                    台灣本土的Podcast平台。
                                                                </Typography>
                                                                <Button
                                                                    fullWidth
                                                                    color="primary" 
                                                                    size="large" 
                                                                    variant="outlined" 
                                                                    target='_blank' 
                                                                    href="https://airtable.com/shrJdWIve8yhFirdU">
                                                                        申請上架
                                                                </Button>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </>
                                            :
                                            <>
                                                <InfoIcon style={ { fontSize: "128px", } }/>
                                                <Typography variant="h6">請將節目設為公開</Typography>
                                                <Typography variant="h6">才能在其他平台上架</Typography>
                                            </>
                                        }
                                    </TabPanel>

                                    <TabPanel value={tabValue} index={2}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={4}>
                                                <Typography variant="h4">節目嵌入貼紙</Typography>
                                                <Typography variant="body1" component="h5">透過程式碼，將節目嵌入在個人網站上</Typography><br/>
                                            </Grid>
                                            <Grid item xs={12} md={8}>
                                                <iframe frameborder="0" height="200px" style={{width:"100%", maxWidth:"660px", overflow:"hidden"}} src={props.baseWwwUrl + "embed/" + props.user.userId}></iframe>
                                                <br/><br/>
                                                <TextField
                                                    label="程式碼"
                                                    multiline
                                                    rows={4}
                                                    defaultValue={embedCode}
                                                    variant="outlined"
                                                    fullWidth
                                                    inputProps={
                                                        { readOnly: true, }
                                                    }
                                                />
                                                <br/><br/>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="large"
                                                    className={classes.button}
                                                    onClick={ () => { handleCopy(embedCode) } }
                                                    >
                                                    複製程式碼
                                                </Button>
                                            </Grid>
                                        </Grid>
                                        <br/>
                                        <Divider/>
                                        <br/>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={4}>    
                                                <Typography variant="h4">社群媒體帳號</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={8}>
                                                <FormControl fullWidth className={classes.fullWidthInput}>
                                                <Typography className={classes.facebookColor} variant="body1" gutterBottom><FacebookIcon/>Facebook</Typography>
                                                    <TextField disabled={handleCode==="loading"} 
                                                                value={facebookLink} 
                                                                onChange={(e)=>setFacebookLink(e.target.value)} 
                                                                id="fb" 
                                                                variant="outlined"
                                                                placeholder="https://" />
                                                </FormControl>
                                                <FormControl fullWidth className={classes.fullWidthInput}>
                                                <Typography className={classes.instagramColor} variant="body1" gutterBottom><InstagramIcon/>Instagram</Typography>
                                                    <TextField disabled={handleCode==="loading"} 
                                                                value={instagramLink} 
                                                                onChange={(e)=>setInstargramLink(e.target.value)} 
                                                                id="ig" 
                                                                variant="outlined"
                                                                placeholder="https://" />
                                                </FormControl>
                                                <FormControl fullWidth className={classes.fullWidthInput}>
                                                <Typography className={classes.youtubeColor} variant="body1" gutterBottom><YouTubeIcon/>Youtube</Typography>
                                                    <TextField disabled={handleCode==="loading"} 
                                                                value={youtubeLink} 
                                                                onChange={(e)=>setYoutubeLink(e.target.value)} 
                                                                id="yt" 
                                                                variant="outlined"
                                                                placeholder="https://" />
                                                </FormControl>
                                                <FormControl fullWidth className={classes.fullWidthInput}>
                                                <Typography className={classes.twitterColor} variant="body1" gutterBottom><TwitterIcon/>Twitter</Typography>
                                                    <TextField disabled={handleCode==="loading"} 
                                                                value={twitterLink} 
                                                                onChange={(e)=>setTwitterLink(e.target.value)} 
                                                                id="twitter" 
                                                                variant="outlined"
                                                                placeholder="https://" />
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                        <br/>
                                        <Divider/>
                                        <br/>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={4}>
                                                <Typography variant="h4">Onelink</Typography>
                                                <Typography variant="body1" component="h5">分享單一網址，就讓聽眾前往你的全世界！</Typography><br/>
                                            </Grid>
                                            <Grid item xs={12} md={8}>
                                                <TextField
                                                    label="Onelink"
                                                    rows={1}
                                                    defaultValue={oneLinkUrl}
                                                    variant="outlined"
                                                    fullWidth
                                                    inputProps={
                                                        { readOnly: true, }
                                                    }
                                                />
                                                <br/><br/>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="large"
                                                    className={classes.button}
                                                    onClick={ () => { handleCopy(oneLinkUrl) } }
                                                    >
                                                    複製連結
                                                </Button>
                                            </Grid>
                                        </Grid>

                                    </TabPanel>
                            </SwipeableViews> 
                            </>
                        }
                        <Snackbar open={handleCode==="suc"} autoHideDuration={3000} onClose={()=>{setHandleCode("init")}} message="您的變更已經儲存"/>
                        <Snackbar open={showCopyMsg===true} autoHideDuration={3000} onClose={()=>{setShowCopyMsg(false)}} message="已經複製到剪貼簿"/>
                        <Dialog
                            open={ err !== false  }
                        >
                            <DialogTitle id="alert-dialog-title">{"提示"}</DialogTitle>
                            <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                {introErr}<br/>{nameErr}<br/>{userIdErr} <br/> {categoryErr} {err}
                            </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                            <Button 
                                onClick={
                                        ()=>{
                                            setIntroErr(false); 
                                            setNameErr(false); 
                                            setErr(false); 
                                            setUserIdErr(false);
                                            setCategoryErr(false);
                                            }
                                        } 
                                color="primary" 
                                autoFocus>
                                好
                            </Button>
                            </DialogActions>
                        </Dialog>
                </Container>
                :
                <CircularProgress />
            }
            </>
        );
    }
}
export default PodcastAccount;
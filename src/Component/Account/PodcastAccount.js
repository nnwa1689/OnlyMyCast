//react
import React, { useState, useEffect, useRef } from 'react'
import MDEditor from '@uiw/react-md-editor';
//ui
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
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
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import SwipeableViews from 'react-swipeable-views';
import { Divider } from '@material-ui/core';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import YouTubeIcon from '@material-ui/icons/YouTube';
import TwitterIcon from '@material-ui/icons/Twitter';
//customUI
import TabPanel from '../CustomComponent/TabPanel';
//firebase
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
//other
import { Helmet } from 'react-helmet';


const useStyles = makeStyles((theme)=>({
    root: {
        minWidth: 275,
        marginTop: 100,
        borderRadius: "10px",
        
        alignItems:"center",
        textAlign:"center"
    },
    appBar: {
      top: 'auto',
      bottom: 0,
      alignItems:"center"
    },
    large: {
        width: theme.spacing(24),
        height: theme.spacing(24),
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
    margin: {
        marginBottom: theme.spacing(2),
        marginTop:theme.spacing(2)
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
    }
  }));
  
  
const PodcastAccount = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const [pageLoaded, setPageLoaded] = useState(false);
    const [name, setName] = useState("");
    const [avatar,setAvatar] = useState("");
    const [intro, setIntro] = useState("");
    const [userId, setUserId] = useState(props.user.userId);
    const [filename, setFilename] = useState("");
    const [fileBit, setFileBit] = useState();
    const [handleCode, setHandleCode] = useState('init');
    const [channelData, setChannelData] = useState("");
    const [nameErr, setNameErr] = useState(false);
    const [userIdErr, setUserIdErr] = useState(false);
    const [introErr, setIntroErr] = useState(false);
    const isFirstLoad = useRef(true);
    const [embedCode, setEmbedCode] = useState();
    const [showCopyMsg, setShowCopyMsg] = useState(false);

    const [facebookLink, setFacebookLink] = useState();
    const [youtubeLink, setYoutubeLink] = useState ();
    const [instagramLink, setInstargramLink] = useState();
    const [twitterLink, setTwitterLink] = useState();

    const [tabValue, setTabValue] = useState(0);

    useEffect(
        ()=>{
            if (isFirstLoad.current) {
                if (props.user.userId !== "") {
                    firebase.firestore().collection("channel").doc(props.user.userId).get()
                    .then(
                      (doc)=>{
                        const data = doc.data();
                        setChannelData(data);
                        setName(data.name);
                        setIntro(data.intro);
                        setAvatar(data.icon);
                        setFacebookLink(data.facebook === undefined ? "" : data.facebook);
                        setInstargramLink(data.instagram === undefined ? "" : data.instagram);
                        setYoutubeLink(data.youtube === undefined ? "" : data.youtube);
                        setTwitterLink(data.twitter=== undefined ? "" : data.twitter);
                        setEmbedCode(
                            `<iframe frameborder="0" height="200px" style="width:100%;max-width:660px;overflow:hidden;" src="https://onlymycast.notes-hz.com/webapp/embed/` + props.user.userId + `"></iframe>`
                        )
                      }
                    );
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
        if (name==="" || userId==="" || intro==="" || !(/^[A-Za-z0-9_.]*$/.test(userId))) {
            if (name==="")
                setNameErr("電台名稱不能為空");
            if (userId==="")
                setUserIdErr("電台ID不能為空");
            if (intro==="")
                setIntroErr("電台簡介不能為空");
            if (!(/^[A-Za-z0-9_.]*$/.test(userId)))
                setUserIdErr("電台 ID 只能輸入英數")
            setHandleCode('error')
        } else {
            firebase.firestore().collection("channel").doc(userId).get()
            .then(
              (doc)=>{
                  if (doc.exists) {
                      setHandleCode('error');
                      setUserIdErr("該 ID 已經存在！");
                  } else {
                    firebase.firestore().collection("user").doc(props.userUid).set({
                        userId:userId
                    }, { merge: true }).then(
                        ()=>{
                            firebase.firestore().collection("channel").doc(userId).set({
                                name:name,
                                intro:intro,
                                userId: userId,
                                updateTime:firebase.firestore.FieldValue.serverTimestamp(),
                                uid : props.userUid
                            }, { merge: true }).then(
                                ()=>{
                                    if (filename !== "") {
                                        var storageRef = firebase.storage().ref().child('/channelIcon/' + userId + "/" + filename);
                                        storageRef.put(fileBit).then((s) => {
                                            storageRef.getDownloadURL()
                                            .then((url) => {
                                                setAvatar(url);
                                                firebase.firestore().collection("channel").doc(userId).set({
                                                    icon:url
                                                }, { merge: true }).then(
                                                    ()=>{
                                                        setHandleCode('suc');
                                                        setFilename("");
                                                        setFileBit();
                                                    }
                                                )
                                            })
                                        });
                                    } else {
                                        setHandleCode('suc');
                                        setFilename("");
                                        setFileBit();
                                    }
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
                setNameErr("電台名稱不能為空");
            if (userId==="")
                setUserIdErr("電台ID不能為空");
            if (intro==="")
                setIntroErr("電台簡介不能為空");
            setHandleCode('error')
        } else {
            firebase.firestore().collection("channel").doc(userId).set({
                name : name,
                intro : intro,
                facebook : facebookLink,
                instagram : instagramLink,
                youtube : youtubeLink,
                twitter : twitterLink,
            }, { merge: true }).then(
                ()=>{
                    if (filename !== "") {
                        var storageRef = firebase.storage().ref().child('/channelIcon/' + userId + "/" + filename);
                        storageRef.put(fileBit).then((s) => {
                            storageRef.getDownloadURL()
                            .then((url) => {
                                setAvatar(url);
                                firebase.firestore().collection("channel").doc(userId).set({
                                    icon:url
                                }, { merge: true }).then(
                                    ()=>{
                                        setHandleCode('suc');
                                        setFilename("");
                                        setFileBit();
                                    }
                                )
                            })
                        });
                    } else {
                        setHandleCode('suc');
                        setFilename("");
                        setFileBit();
                    }
                }
            )
        }
    }

    const handleCopyUrl = (url)=> {
        navigator.clipboard.writeText(url)
        .then(() => {
            setShowCopyMsg(true);
        }).catch(err => {
        console.log('Something went wrong', err);
        })
    }

    const handleCopyEmbedCode = () => {
        navigator.clipboard.writeText(embedCode)
        .then(() => {
            setShowCopyMsg(true);
        }).catch(err => {
            //
        })
    }

    if (name === "" || avatar === "" || intro === ""){
        return(<CircularProgress style={{marginTop: "25%"}} />);
    } else {
        return(
            <>
            <Helmet>
                <title>電台設定 - Onlymycast</title>
            </Helmet>
            {
                pageLoaded ?
                    <Container maxWidth="md">
                        { props.user.userId === "" ? 
                            <Card className={classes.root}>
                                <CardContent>
                                <Typography variant="h5" component="h1">建立電台</Typography>
                                <Typography variant="body1" component="span">建立屬於您的私人電台，這裡的資訊將於電台首頁顯示</Typography>
                                <Avatar variant="rounded" src={avatar} className={classes.large} />
                                <form noValidate autoComplete="off">
                                <FormControl fullWidth className={classes.margin}>
                                    <input
                                        accept="image/jpeg, image/png, image/jpg"
                                        className={classes.input}
                                        id="contained-button-file"
                                        multiple
                                        type="file"
                                        startIcon={<AttachmentIcon />}
                                        disabled={handleCode==='loading'|| handleCode==="suc"}
                                        onChange={(e)=>{
                                            if (e.target.files.length >= 1) {
                                                setAvatar(URL.createObjectURL(e.target.files[0]));
                                                setFilename(e.target.files[0].name);
                                                setFileBit(e.target.files[0])
                                            }
                                        }}
                                    />
                                    <label htmlFor="contained-button-file">
                                        <Button disabled={handleCode==='loading'|| handleCode==="suc"} variant="contained" size="large" fullWidth color="primary" component="span">
                                            <AttachmentIcon />
                                            { filename === "" ? "上傳頻道封面" : filename }
                                        </Button>
                                        <Typography variant="body2" component="span">只能上傳.jpg/.jpeg/.png</Typography>
                                    </label>
                                    </FormControl>
                                <FormControl fullWidth className={classes.margin}>
                                    <TextField 
                                    error={ nameErr!==false } 
                                    helperText={ nameErr !== false && nameErr} 
                                    value={name} 
                                    onChange={(e)=>setName(e.target.value)} 
                                    id="outlined-name"
                                    variant="outlined"
                                    label="電台名稱"
                                    disabled={handleCode==='loading'|| handleCode==="suc"}
                                    required />
                                </FormControl>
                                <FormControl fullWidth className={classes.margin}>
                                    <TextField
                                    error={ userIdErr!==false } 
                                    helperText={ userIdErr !== false ? userIdErr : "聽眾將透過電台ID搜尋您的頻道，建立後不可變更！"} 
                                    value={userId} 
                                    onChange={(e)=>setUserId(e.target.value.replace("/[\W]/g,''"))}
                                    id="outlined-basic" 
                                    label="電台ID" 
                                    variant="outlined"
                                    disabled={handleCode==='loading'|| handleCode==="suc"} 
                                    required
                                    />
                                </FormControl>
                                <FormControl fullWidth className={classes.margin}>
                                <InputLabel>電台簡介</InputLabel>
                                <OutlinedInput id="component-outlined" value="falksjd" style={{display:"none"}}/>
                                <br/>
                                <MDEditor
                                    value={intro}
                                    onChange={setIntro}
                                />   
                                <br/> <br/>                  
                                </FormControl>      
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        className={classes.button}
                                        onClick={handleCreateChannel}
                                        disabled={handleCode==='loading'|| handleCode==="suc"}
                                        startIcon={ handleCode==='loading'? <CircularProgress size={24} className={classes.buttonProgress} /> : <SaveIcon />}>
                                        建立電台
                                    </Button>
                                    <br/><br/>
                                    <Snackbar open={handleCode==="suc"} autoHideDuration={3000} onClose={()=>{window.location.reload()}} message="您的頻道已經建立"/>
                                </form>
                                </CardContent>
                            </Card>
                            :
                            <>
                            <Card className={classes.root}>
                                <CardContent>
                                <AppBar className={classes.tabBar} position="static" color="default">
                                    <Tabs
                                    value={tabValue}
                                    onChange={handleChange}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    variant="fullWidth"
                                    aria-label="full width tabs example"
                                    >
                                    <Tab label="電台資訊" />
                                    <Tab label="社群媒體" />
                                    <Tab label="電台推廣" />
                                    </Tabs>
                                </AppBar>
                                <SwipeableViews
                                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                                    index={tabValue}
                                    onChangeIndex={handleChangeIndex}>
                                    <TabPanel value={tabValue} index={0}>
                                        <Typography variant="h5" component="h1">編輯電台資訊</Typography>
                                        <Typography variant="body1" component="span">更新您的電台資訊，這裡的資訊將於電台首頁顯示。</Typography>
                                        <Avatar variant="rounded" alt={name} src={avatar} className={classes.large} />
                                        <form noValidate autoComplete="off">
                                        <FormControl fullWidth className={classes.margin}>
                                            <input
                                                accept="image/jpge, image/jpg, image/png"
                                                className={classes.input}
                                                id="contained-button-file"
                                                multiple
                                                type="file"
                                                startIcon={<AttachmentIcon />}
                                                disabled={handleCode==="loading"}
                                                onChange={(e)=>{
                                                    if (e.target.files.length >= 1) {
                                                        setAvatar(URL.createObjectURL(e.target.files[0]));
                                                        setFilename(e.target.files[0].name);
                                                        setFileBit(e.target.files[0])
                                                    }
                                                }}
                                            />
                                            <label htmlFor="contained-button-file">
                                                <Button disabled={handleCode==="loading"} variant="outlined" size="large" fullWidth color="primary" component="span">
                                                    <AttachmentIcon />
                                                    { filename === "" ? "上傳頻道封面" : filename }
                                                </Button>
                                                <Typography variant="body2" component="span">只能上傳.jpg/.jpeg/.png</Typography>
                                            </label>
                                        </FormControl>
                                        <FormControl fullWidth className={classes.margin}>
                                            <TextField required disabled={handleCode==="loading"} value={name} onChange={(e)=>setName(e.target.value)} id="outlined-basic" label="電台名稱" variant="outlined" />
                                        </FormControl>
                                        <FormControl fullWidth className={classes.margin}>
                                        <InputLabel>電台簡介</InputLabel>
                                        <OutlinedInput id="component-outlined" value="..." style={{display:"none"}}/>
                                        <br/>
                                        <MDEditor
                                            value={intro}
                                            onChange={setIntro}
                                        />
                                        </FormControl>     
                                        <br/> <br/> 
                                        <FormControl fullWidth className={classes.margin}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="large"
                                                className={classes.button}
                                                onClick={handleUpdateChannel}
                                                disabled={handleCode==="loading"}
                                                startIcon={ handleCode==='loading'? <CircularProgress size={24} className={classes.buttonProgress} /> : <SaveIcon />}>
                                                儲存設定
                                            </Button>   
                                        </FormControl>
                                        </form>
                                    </TabPanel>
                                    <TabPanel value={tabValue} index={1}>
                                            <Typography variant="h5" component="h1">社群媒體帳號</Typography>
                                            <Typography variant="body1" component="span">設定電台的社群媒體網址，讓聽眾在別的地方找到您</Typography>
                                            <br/><br/><Divider/>
                                            <FormControl fullWidth className={classes.margin}>
                                            <Typography className={classes.facebookColor} variant="body1" gutterBottom><FacebookIcon/>Facebook</Typography>
                                                <TextField disabled={handleCode==="loading"} 
                                                            value={facebookLink} 
                                                            onChange={(e)=>setFacebookLink(e.target.value)} 
                                                            id="fb" 
                                                            variant="outlined"
                                                            placeholder="https://" />
                                            </FormControl>
                                            <FormControl fullWidth className={classes.margin}>
                                            <Typography className={classes.instagramColor} variant="body1" gutterBottom><InstagramIcon/>Instagram</Typography>
                                                <TextField disabled={handleCode==="loading"} 
                                                            value={instagramLink} 
                                                            onChange={(e)=>setInstargramLink(e.target.value)} 
                                                            id="ig" 
                                                            variant="outlined"
                                                            placeholder="https://" />
                                            </FormControl>
                                            <FormControl fullWidth className={classes.margin}>
                                            <Typography className={classes.youtubeColor} variant="body1" gutterBottom><YouTubeIcon/>Youtube</Typography>
                                                <TextField disabled={handleCode==="loading"} 
                                                            value={youtubeLink} 
                                                            onChange={(e)=>setYoutubeLink(e.target.value)} 
                                                            id="yt" 
                                                            variant="outlined"
                                                            placeholder="https://" />
                                            </FormControl>
                                            <FormControl fullWidth className={classes.margin}>
                                            <Typography className={classes.twitterColor} variant="body1" gutterBottom><TwitterIcon/>Twitter</Typography>
                                                <TextField disabled={handleCode==="loading"} 
                                                            value={twitterLink} 
                                                            onChange={(e)=>setTwitterLink(e.target.value)} 
                                                            id="twitter" 
                                                            variant="outlined"
                                                            placeholder="https://" />
                                            </FormControl>
                                            <FormControl fullWidth className={classes.margin}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="large"
                                                className={classes.button}
                                                onClick={handleUpdateChannel}
                                                disabled={handleCode==="loading"}
                                                startIcon={ handleCode==='loading'? <CircularProgress size={24} className={classes.buttonProgress} /> : <SaveIcon />}>
                                                儲存設定
                                            </Button>   
                                        </FormControl>
                                    </TabPanel>
                                    <TabPanel value={tabValue} index={2}>
                                            <Typography variant="h5" component="h1">推廣電台</Typography>
                                            <Typography variant="body1" component="span">把電台和朋友一起分享:))</Typography>
                                            <br/><br/><Divider/><br/>
                                            <Typography variant="h5" component="span">透過電台ID</Typography><br/><br/>
                                            <Typography variant="h4" component="span">{userId} </Typography><br/><br/>
                                            <Typography variant="body1" component="span">將電台ID分享給朋友，朋友可以透過搜尋來找到你的電台。</Typography>
                                            <br/><br/>
                                            <Divider/>
                                            <br/>
                                            <Typography variant="h5" component="span">透過URL</Typography><br/><br/>
                                            <ButtonGroup size="large">
                                                <TextField
                                                    label="電台URL"
                                                    defaultValue={"https://onlymycast.notes-hz.com/webapp/podcast/" + userId}
                                                    variant="outlined"
                                                    />
                                                    <Button color="primary" variant="outlined" onClick={()=>{handleCopyUrl("https://onlymycast.notes-hz.com/webapp/podcast/" + userId)}}>複製</Button>
                                            </ButtonGroup><br/><br/>
                                            <Typography variant="body1" component="span">向你的朋友分享這個網址，讓他們來收聽你的電台</Typography><br/>
                                            <br/><br/>
                                            <Divider/>
                                            <br/>
                                            <Typography variant="h5" component="span">透過嵌入貼紙</Typography><br/><br/>
                                            <Typography variant="body1" component="span">透過程式碼，將電台資訊嵌入在個人網站上面</Typography><br/>
                                            <br/>
                                            <iframe frameborder="0" height="200px" style={{width:"100%", maxWidth:"660px", overflow:"hidden"}} src={"https://onlymycast.notes-hz.com/webapp/embed/" + props.user.userId}></iframe>
                                            <br/><br/>
                                            <TextField
                                                label="程式碼"
                                                multiline
                                                rows={4}
                                                defaultValue={embedCode}
                                                variant="outlined"
                                                fullWidth
                                            />
                                            <br/><br/>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="large"
                                                className={classes.button}
                                                onClick={handleCopyEmbedCode}
                                                >
                                                複製程式碼
                                            </Button>
                                            <br/><br/>
                                    </TabPanel>
                                </SwipeableViews>                                            
                                </CardContent>
                            </Card>
                            </>
                        }
                        <Snackbar open={handleCode==="suc"} autoHideDuration={3000} onClose={()=>{setHandleCode("init")}} message="您的變更已經儲存"/>
                        <Snackbar open={showCopyMsg===true} autoHideDuration={3000} onClose={()=>{setShowCopyMsg(false)}} message="已經複製到剪貼簿"/>
                        <Dialog
                            open={introErr!==false || nameErr!==false}
                            onClose={()=>{setIntroErr(false);setNameErr(false)}}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"提示"}</DialogTitle>
                            <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                {introErr}<br/>{nameErr}
                            </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={()=>{setIntroErr(false); setNameErr(false)}} color="primary" autoFocus>
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
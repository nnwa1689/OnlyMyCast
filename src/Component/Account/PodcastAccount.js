//react
import React, { useState, useEffect, useRef } from 'react'
import MDEditor from '@uiw/react-md-editor';
//ui
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import { deepOrange } from '@material-ui/core/colors';
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
//firebase
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";


const useStyles = makeStyles((theme)=>({
    root: {
        minWidth: 275,
        marginTop: 100,
        
        alignItems:"center",
        textAlign:"center"
    },
    appBar: {
      top: 'auto',
      bottom: 0,
      alignItems:"center"
    },
    large: {
      width: theme.spacing(20),
      height: theme.spacing(20),
      marginBottom: theme.spacing(3),
      marginTop:theme.spacing(3),
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
      marginLeft:"auto",
      marginRight:"auto"
    },
    orange: {
        color: theme.palette.getContrastText(deepOrange[500]),
        backgroundColor: deepOrange[500],
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
  }));

const PodcastAccount = (props) => {
    const classes = useStyles();
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

    useEffect(
        ()=>{
            if (props.user.userId !== "" && isFirstLoad.current) {
                firebase.firestore().collection("channel").doc(props.user.userId).get()
                .then(
                  (doc)=>{
                    setChannelData(doc.data());
                    setName(doc.data().name);
                    setIntro(doc.data().intro);
                    setAvatar(doc.data().icon);
                  }
                );
                isFirstLoad.current = false;
            }
            window.scrollTo(0, 0);
            setPageLoaded(true);
        }
    )

    const handleCreateChannel = () => {
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
                name:name,
                intro:intro,
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
        console.log("Text copied to clipboard...")
    })
        .catch(err => {
        console.log('Something went wrong', err);
    })
    }

    if (name===undefined){
        return(<CircularProgress style={{marginTop: "25%"}} />);
    } else {
        return(
            <>
            {
                pageLoaded ?
                    <Container maxWidth="sm">
                    <Card className={classes.root}>
                        <CardContent>
                            { props.user.userId === "" ? 
                            <>
                                <Typography variant="h5" component="h1">建立電台</Typography>
                                <Typography variant="body1" component="span">建立屬於您的私人電台<br/>這裡的資訊將於電台首頁公布</Typography>
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
                                                setFilename(e.target.files[0].name);
                                                setFileBit(e.target.files[0])
                                            }
                                        }}
                                    />
                                    <label htmlFor="contained-button-file">
                                        <Button disabled={handleCode==='loading'|| handleCode==="suc"} variant="contained" size="large" fullWidth color="primary" component="span">
                                            <AttachmentIcon />
                                            { filename === "" ? "上傳ICON" : filename }
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
                                    id="outlined-basic" 
                                    label="電台名稱" 
                                    variant="outlined"
                                    disabled={handleCode==='loading'|| handleCode==="suc"} />
                                </FormControl>
                                <FormControl fullWidth className={classes.margin}>
                                    <TextField
                                    error={ userIdErr!==false } 
                                    helperText={ userIdErr !== false ? userIdErr : "聽眾將透過電台ID搜尋您的頻道，建立後不可變更！"} 
                                    value={userId} 
                                    onChange={(e)=>setUserId(e.target.value)} 
                                    id="outlined-basic" 
                                    label="電台ID" 
                                    variant="outlined"
                                    disabled={handleCode==='loading'|| handleCode==="suc"} />
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
                            </>
                            :
                            <>
                                <Typography variant="h5" component="h1">編輯電台資訊</Typography>
                                <Typography variant="body1" component="span">更新您的電台資訊<br/>這裡的資訊將於電台首頁公布</Typography>
                                <Avatar variant="rounded" alt={name} src={avatar} className={classes.large} />
                                <Typography variant="body1" component="span">電台ID：{userId}</Typography><br/><br/>
                                <ButtonGroup size="small" fullWidth>
                                    <TextField
                                        label="電台URL"
                                        defaultValue={"https://onlymycast.notes-hz.com/webapp/podcast/" + userId}
                                        variant="outlined"
                                        style={{width: "60%"}}
                                        />
                                        <Button style={{width: "40%"}} color="primary" variant="outlined" onClick={()=>{handleCopyUrl("https://onlymycast.notes-hz.com/webapp/podcast/" + userId)}}>複製</Button>
                                </ButtonGroup><br/>
                                <Typography variant="body2" component="span">向你的朋友分享這個網址，讓他們來收聽你的電台</Typography><br/>
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
                                                setFilename(e.target.files[0].name);
                                                setFileBit(e.target.files[0])
                                            }
                                        }}
                                    />
                                    <label htmlFor="contained-button-file">
                                        <Button disabled={handleCode==="loading"} variant="contained" size="large" fullWidth color="primary" component="span">
                                            <AttachmentIcon />
                                            { filename === "" ? "上傳ICON" : filename }
                                        </Button>
                                        <Typography variant="body2" component="span">只能上傳.jpg/.jpeg/.png</Typography>
                                    </label>
                                    </FormControl>
                                <FormControl fullWidth className={classes.margin}>
                                    <TextField disabled={handleCode==="loading"} value={name} onChange={(e)=>setName(e.target.value)} id="outlined-basic" label="電台名稱" variant="outlined" />
                                </FormControl>
                                <FormControl fullWidth className={classes.margin}>
                                <InputLabel>電台簡介</InputLabel>
                                <OutlinedInput id="component-outlined" style={{display:"none"}}/>
                                <br/>
                                <MDEditor
                                    value={intro}
                                    onChange={setIntro}
                                />
                                </FormControl>     
                                <br/> <br/> 
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
                                    <br/><br/>
                                    <Snackbar open={handleCode==="suc"} autoHideDuration={3000} onClose={()=>{setHandleCode("init")}} message="您的變更已經儲存"/>
                                </form>
                                </>
                        }
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
                        </CardContent>
                    </Card>
                </Container>
                :
                <CircularProgress />
            }
            </>
        );
    }
}
export default PodcastAccount;
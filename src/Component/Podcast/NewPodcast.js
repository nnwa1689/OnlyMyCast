//react
import React, { useState, useRef, useEffect } from 'react'
import { Redirect } from 'react-router-dom';
import { Link as RLink } from 'react-router-dom';
import {Recorder} from 'react-voice-recorder'
import 'react-voice-recorder/dist/index.css'
import sha256 from 'crypto-js/sha256';
import InlinePlayer from '../Player/InlinePlayer';
import MDEditor from '@uiw/react-md-editor';
//ui
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import AttachmentIcon from '@material-ui/icons/Attachment';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';
import SaveIcon from '@material-ui/icons/Save';
import Tooltip from '@material-ui/core/Tooltip';
import Snackbar from '@material-ui/core/Snackbar';
//firebase
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const useStyles = makeStyles((theme)=>({
    root: {
      minWidth: 275,
      marginTop: 100,
      marginBottom: 0,
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    large: {
        width: theme.spacing(10),
        height: theme.spacing(10),
        marginRight: theme.spacing(2)
      },
    backButton: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    input: {
        display: 'none',
      },
      margin: {
        marginBottom: theme.spacing(2),
        marginTop:theme.spacing(2)
      },
  })
  );

  function LinearProgressWithLabel(props) {
    return (
      <Box display="flex" alignItems="center">
        <Box width="100%" mr={1}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box minWidth={35}>
          <Typography variant="body2" color="textSecondary">{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }

  const NewPodcast = (props) => {

    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const [filename, setFilename] = useState("");
    const [filePath, SetFilePath] = useState();
    const [fileBit, setFileBit] = useState();
    const [intro, setIntro] = useState("");
    const [podcastTitle, setPodcastTitle] = useState("");
    const [titleErr, setTitleErr] = useState(false);
    const [introErr, setIntroErr] = useState(false);
    const [err, setErr] = useState(false);
    const [uploadStatu, setUploadStatu] = useState(0);
    const [uploadProgress, setUploadProgres] = useState();
    const [handleDarftCode, setHandleDarftCode] = useState('init');
    const duration = useRef("");
    const isFirstLoad = useRef(true);
    //0:init 1:suc 2:uploading 3:err
    let audioFileRef = "";

    useEffect(
        ()=>{
            if (isFirstLoad.current) {
                if (activeStep===1) {
                    getDarft();
                }
                window.scrollTo(0, 0);
                isFirstLoad.current = false;
            }
        }
    )

    /*

    const [audioDetails, setAudioDetails] = useState(
        {
            url:null,
            blob:null,
            chunks:null,
            duration:{
                h:0,m:0,s:0
            }
        }
    )

    const handleAudioStop = (data) => {
        setAudioDetails(data);
        var filename = sha256(new Date().toISOString()).toString();
        setFileBit(data.blob);
        console.log(data);
        console.log(data.blob);
        setFilename(filename);
        console.log(data.blob.type)
        
    }

    const handleAudioUpload = (file) => {
        console.log(file);
    }

    const handleReset = () => {
        const resetData =         
        {
            url:null,
            blob:null,
            chunks:null,
            duration:{
                h:0,m:0,s:0
            }
        }

        setAudioDetails(resetData);
    }
    */

    const fromPlayerGetDuration = (value) => {
         duration.current = parseInt(value/60, 10) + ":" + Math.ceil(parseInt(value, 10)%60);
    }

    const uploadAudioFile = async()=> {
        //upload
        const hashFilename = sha256(filename + Date.now());
        const fileRef = 'podcastaudio/' + props.user.userId + "/" + hashFilename;
        audioFileRef = fileRef;
        var storageRef = firebase.storage().ref().child(fileRef);
        return new Promise(async(resole, reject)=>{
            var uploadTask = storageRef.put(fileBit);
            uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setUploadProgres(progress);
            },(error)=>{setUploadStatu(3); setErr(error)});
            uploadTask.then((s) => {
            storageRef.getDownloadURL()
            .then(async(url) => {
                resole(url);
            });
        });
        }) 
    }

    const getDarft = () => {
        firebase.database().ref('/castDarft/' + props.user.userId).once("value", e => {
        }).then(async(e)=>{
            const data = e.val();
            if (data !== undefined && data !== null) {
                setHandleDarftCode("get");
                setPodcastTitle(data.podcastTitle);
                setIntro(data.intro);
            }
        })
    }

    const handleRemoveDarft = async() => {
        await firebase.database().ref('/castDarft/' + props.user.userId).remove();
    }

    const handleSaveDarft = () => {
        if (podcastTitle==="" || intro==="") {
            setErr(true);
            if (podcastTitle==="") {
                setTitleErr("單集標題不能為空");
            }
            if (intro==="") {
                setIntroErr("單集介紹不能為空");
            }
        } else {
            setHandleDarftCode('loading');
            firebase.database().ref('/castDarft/' + props.user.userId).update(
                {
                    podcastTitle : podcastTitle,
                    intro:intro,
                }
            ).then(()=>{
                setHandleDarftCode('suc');
            }).catch();
        }
    }

    const updateChannelDate = async()=>{
        await firebase.firestore().collection("channel").doc(props.user.userId).set({
            updateTime:firebase.firestore.FieldValue.serverTimestamp(),
            uid:props.userUid
        }, { merge: true }).then((event)=>{

        }).catch((error)=>{
            setUploadStatu(3); setErr(error);
        })
    }
    
    const handleUploadPodcast = async() => {
        if (podcastTitle==="" || intro==="") {
            if (podcastTitle==="") {
                setTitleErr("單集標題不能為空");
            }
            if (intro==="") {
                setIntroErr("單集介紹不能為空");
            }
        } else {
            setActiveStep(3);setUploadStatu(2);
            await uploadAudioFile().then(async(url)=>{
                console.log(duration.current);
                await firebase.firestore().collection("podcast").doc(props.user.userId).collection("podcast").add({
                    url: url,
                    intro:intro,
                    title: podcastTitle,
                    updateTime:firebase.firestore.FieldValue.serverTimestamp(),
                    uid:props.userUid,
                    fileRef:audioFileRef,
                    duration:duration.current
                }, { merge: true }).then((event)=>{
                    updateChannelDate().then(()=>{
                        handleRemoveDarft().then(setUploadStatu(1));
                    }
                    )
                }).catch((error)=>{
                    setUploadStatu(3); setErr(error);
                })
            });
        }
    }

    if (props.user.userId==="") {
        return(
            <Container maxWidth="sm">
                <Card className={classes.root}>
                    <CardContent>
                        <Typography variant="h2" component="h1" gutterBottom>
                            (＾ｰ^)ノ<br/>
                        </Typography>
                        <Typography variant="h5" component="span">
                            嗨<br/>你還沒有建立電台 ╮(╯▽╰)╭<br/>                            
                        </Typography>
                        <br/>
                        <Button
                            component={RLink}
                            to="/podcastaccount"
                            color="primary"
                            fullWidth
                            size="large"
                            variant="contained"
                            >              
                            立即建立屬於我的私人電台
                            </Button>
                    </CardContent>
                </Card>
            </Container>
        )
    } else {
        return(
            <Container maxWidth="sm">
                <Card className={classes.root}>
                    <CardContent>
                    <Typography variant="h5" component="h1">發佈單集</Typography>
                    <Typography variant="body1" component="span">依照步驟來發佈您電台的單集</Typography>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        <Step key={0}>
                            <StepLabel>{"選擇預錄好的音檔"}</StepLabel>
                        </Step>
                        <Step key={1}>
                            <StepLabel>{"設定單集相關資訊"}</StepLabel>
                        </Step>
                        <Step key={2}>
                            <StepLabel>{"準備上傳"}</StepLabel>
                        </Step>
                    </Stepper>

                    { activeStep === 0 &&
                    (<>
                         <input
                            accept=".mp3, .mp4, .m4a"
                            className={classes.input}
                            id="contained-button-file"
                            multiple
                            type="file"
                            startIcon={<AttachmentIcon />}
                            onChange={(e)=>{
                                if (e.target.files.length >= 1) {
                                    setFilename(e.target.files[0].name);
                                    setFileBit(e.target.files[0]);
                                    SetFilePath(URL.createObjectURL(e.target.files[0]));
                                }
                            }}
                        />
                        <br/>
                        {filename !== "" &&<InlinePlayer url={filePath} fileSize={fileBit.size} returnDuration={(value)=>fromPlayerGetDuration(value)}/>}
                        <br/>
                        <label htmlFor="contained-button-file">
                            <Button variant="contained" size="large" color="primary" component="span">
                                <AttachmentIcon />
                                { filename === "" ? "選擇檔案" : filename }</Button>
                                <br/><br/>
                                <Typography variant="body1" gutterBottom>
                                    僅限 mp3/mp4/m4a 格式<br/><br/>手機版 Safari 可能會上傳卡住的問題<br/>請先改用 Chrome
                                </Typography>
                        </label>
                        <br/>
                    </>)
                    }
    
                    { activeStep === 1 &&
                    (
                        <>
                            <FormControl fullWidth className={classes.margin}>
                                <TextField value={podcastTitle} onChange={(e)=>setPodcastTitle(e.target.value)} id="outlined-basic" label="單集標題" variant="outlined" />
                            </FormControl>
                            <FormControl fullWidth className={classes.margin}>
                            <InputLabel>單集簡介</InputLabel>
                                <OutlinedInput id="component-outlined" value="falksjd" style={{display:"none"}}/>
                                <br/>
                                <MDEditor
                                    value={intro}
                                    onChange={setIntro}
                                />   
                                <br/> <br/> 
                                <div className={classes.wrapper}>

                                </div>                                 
                            </FormControl>    
                        </>
                    )
                     }
    
                    { activeStep === 2 &&
                    (
                        <>
                            <Typography variant="h6" gutterBottom>
                                （*＾3＾） 
                            </Typography>
                            <br/>
                            <Typography variant="h6" gutterBottom>
                                單集上傳已經準備就緒，按下完成後就會開始上傳<br/>期間請不要關閉瀏覽器！  
                            </Typography>
                         
                        </>
                    )
                     }
    
                    { //upload suc 
                        uploadStatu === 1 && 
                        <>
                        <Redirect to='/editpodcasts'/>
                        </>
                    }
    
                    {  //uploadErr
                        uploadStatu === 3 && 
                        <>
                            <Typography variant="h6" gutterBottom>
                                (￣◇￣;)<br/><br/>
                                歐歐，上傳處理發生錯誤，一群猴子正在極力強修
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                {"ErrorMsg:" + err}
                            </Typography>
                        </>
                    }
    
                    { //uploading
                        uploadStatu === 2 && 
                        <>
                            <CircularProgress size={80} />
                            <br/><br/>
                                <LinearProgressWithLabel value={uploadProgress} />
                            <br/>
                            <Typography variant="h6" gutterBottom>
                                正在處理上傳作業，請稍候！ <br/>不要離開頁面唷(＞^ω^＜)
                            </Typography>
                        </>
                    }
    
                    <br/><br/>
    
                    {
                    //按鈕 
                        activeStep < 3 &&
                        <>
                            <Divider/>
                            <br/>
                            <Button
                                disabled={activeStep === 0}
                                onClick={()=>setActiveStep(activeStep - 1)}
                                className={classes.backButton}
                            >
                                上一步
                            </Button>
                            {activeStep === 2 ? 
                            <>
                                <Tooltip className={classes.backButton} onClick={handleSaveDarft} title="草稿不會儲存您的檔案，而且一但上傳完成後就會被清除" aria-label="save">
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        className={classes.button}
                                        startIcon={ handleDarftCode==='loading'? <CircularProgress size={24} className={classes.buttonProgress} /> : <SaveIcon />}
                                        disabled={handleDarftCode==="loading"}>
                                        儲存草稿
                                    </Button>
                                </Tooltip>
                                <Button variant="contained" color="primary" onClick={()=>handleUploadPodcast()}>
                                    完成並發布
                                </Button>
                            </>
                            :
                            <Button disabled={ (filename==="" && activeStep===0) || (podcastTitle===""&& activeStep===1) || (intro==="" && activeStep===1) } variant="contained" color="primary" onClick={()=>setActiveStep(activeStep + 1)}>
                                下一步
                            </Button>
                            }
                        </>
                    }
                        <Snackbar open={handleDarftCode==="suc"} autoHideDuration={2000} onClose={()=>{setHandleDarftCode('init')}} message="您的草稿已經儲存"/>
                        <Snackbar open={handleDarftCode==="get"} onClose={()=>{setHandleDarftCode('init')}} autoHideDuration={2000} message="您的草稿已經還原"/>
                    </CardContent>
                </Card>
            </Container>
        );
    
    }
}
export default NewPodcast;
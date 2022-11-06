//react
import React, { useState, useRef, useEffect } from 'react'
import { Redirect } from 'react-router-dom';
import { Link as RLink } from 'react-router-dom';
import MicRecorder from 'mic-recorder-to-mp3';
import sha256 from 'crypto-js/sha256';
import InlinePlayer from '../Player/InlinePlayer';
import MDEditor from '@uiw/react-md-editor';
//ui
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SaveIcon from '@material-ui/icons/Save';
import Tooltip from '@material-ui/core/Tooltip';
import Snackbar from '@material-ui/core/Snackbar';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import PublishIcon from '@material-ui/icons/Publish';
import MuiAlert from '@material-ui/lab/Alert';
import MicIcon from '@material-ui/icons/Mic';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
//custom
import LinearProgressWithLabel from '../CustomComponent/LinearProgressWithLabel';
//firebase
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/functions";
//other
import { Helmet } from 'react-helmet';
import genrssfeed from '../../Functions/genRssfeed';
import { MicNone } from '@material-ui/icons';


const useStyles = makeStyles((theme)=>({
    root: {
        minWidth: 275,
        marginTop: 100,
        borderRadius: "10px",
        alignItems:"center",
        textAlign:"center"
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
    flexLeft: {
        marginRight: "auto",
    },
    flexRight: {
        display: "flex",
        justifyContent: "flex-end"
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
      mostlarge: {
        height: theme.spacing(36),
        width: theme.spacing(36),
        margin:theme.spacing(1),
        borderRadius: 20,
      },
  })
  );


  const NewPodcast = (props) => {

    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const [filename, setFilename] = useState("");
    const [filePath, setFilePath] = useState();
    const [fileBit, setFileBit] = useState();
    const [intro, setIntro] = useState("");
    const [podcastTitle, setPodcastTitle] = useState("");
    const [titleErr, setTitleErr] = useState(false);
    const [introErr, setIntroErr] = useState(false);
    const [err, setErr] = useState(false);
    const [uploadStatu, setUploadStatu] = useState(0);
        //0:init 1:suc 2:uploading 3:err
    const [uploadProgress, setUploadProgres] = useState();
    const [handleDarftCode, setHandleDarftCode] = useState('init');
    const duration = useRef("");
    const isFirstLoad = useRef(true);
    let audioFileRef = "";

    const allowFileType = [
        'audio/mpeg', 'audio/x-m4a', 'audio/mp3'
    ]

    const [recorderType, setRecorderType] = useState(0);
    const [Mp3Recorder, setMp3Recorder] = useState();
    const [isRecording, setIsRecording] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const [recordingDevice, setRecordingDevice] = useState(0);
    const [deviceList, setDeviceList] = useState();
    const [currentTime, setCurrentTime] = useState("0 : 0");
    let currentTimer;

    useEffect(
        ()=>{
            if (isFirstLoad.current) {
                window.scrollTo(0, 0);
                isFirstLoad.current = false;
            }
            /*
            if (activeStep===1 && handleDarftCode==="init") {
                getDarft();
            }
            */
        }
    )

    const onlineRecordingInit = () => {
        let changeArr = [];
        navigator.mediaDevices.getUserMedia({ audio: true },
            () => {
                //console.log('Permission Granted');
                setIsBlocked(false);
            },
            () => {
                //console.log('Permission Denied');
                setIsBlocked(true);
            },
            ).catch(
                (e) => {
                setIsBlocked(true);
                }
            ).then(
                () => {
                    navigator.mediaDevices.enumerateDevices()
                    .then(function(devices) {
                        for(var i of devices) {
                            if (i.kind === "audioinput") {
                                changeArr.push(
                                    <MenuItem key={ i.deviceId } value={ i.deviceId }>{ i.label }</MenuItem>
                                );
                                if (recordingDevice === 0) {
                                    setRecordingDevice(i.deviceId);
                                    setMp3Recorder(new MicRecorder({ bitRate: 128, deviceId: i.deviceId }));
                                }
                            }
                        }
                        setDeviceList(changeArr);
                    })
                    .catch(function(err) {
                        console.log(err.name + ": " + err.message);
                    });
                }
            );
    }

    const selectRecordingType = (type) => {
        setRecorderType(type);
        setActiveStep(1);
    }

    const handleRecordeingButton = () => {
        if (!isRecording) {
            start();
        } else {
            stop();
        }
    }
    
    const start = () => {
        if (isBlocked) {
          console.log('Permission Denied');
        } else {
            setFileBit();
            setFilename("");
            setFilePath();
            Mp3Recorder
            .start()
            .then(() => {
              setIsRecording(true);
              currentTimer =  setInterval(
                () => {
                    setCurrentTime(parseInt(((parseInt(Mp3Recorder.context.currentTime, 10))/60)) + " : " + Math.ceil(((parseInt(Mp3Recorder.context.currentTime, 10))%60)));
                }, 1000
            );
            }).catch((e) => console.error(e));
        }
    }

    const stop = () => {
        Mp3Recorder
          .stop()
          .getMp3()
          .then(([buffer, blob]) => {
            clearInterval(currentTimer);
            const blobURL = URL.createObjectURL(blob);
            setFilePath(blobURL);
            setFileBit(blob)
            setFilename(sha256(new Date().toISOString()).toString() + '.mp3');
            setIsRecording(false);
          }).catch((e) => console.log(e));
      }


    const fromPlayerGetDuration = (value) => {
         duration.current = parseInt(value/60, 10) + ":" + Math.ceil(parseInt(value, 10)%60);
    }

    const uploadAudioFile = async()=> {
        //upload
        const hashFilename = sha256(filename + Date.now());
        const fileRef = 'podcastaudio/' + props.user.userId + "/" + hashFilename + '.' + filename.split(".").pop();
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

    const handlePushMessage = async() => {
        const pushMessage = firebase.functions().httpsCallable('pushMessage');
        await pushMessage({ text: "send" })
          .then((result) => {
            // Read result of the Cloud Function.
            /** @type {any} */
            const data = result.data;
            const sanitizedMessage = data.result;
          });
    }

    const handleSaveDarft = async() => {
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
                await firebase.firestore()
                .collection("podcast")
                .doc(props.user.userId)
                .collection("castdarft")
                .add({
                    url: url,
                    intro:intro,
                    title: podcastTitle,
                    updateTime:firebase.firestore.FieldValue.serverTimestamp(),
                    uid:props.userUid,
                    fileRef:audioFileRef,
                    duration:duration.current
                }, { merge: true }).then((event)=>{
                    setUploadStatu(1);
                }).catch((error)=>{
                    setUploadStatu(3); setErr(error);
                })
            });
        }
    }

    const updateChannelDate = async()=>{
        await firebase.firestore().collection("channel").doc(props.user.userId).set({
            updateTime:firebase.firestore.FieldValue.serverTimestamp(),
            uid:props.userUid
        }, { merge: true }).then((event)=>{

            //rss產生
            genrssfeed(props.user.userId, props.userEmail);
            
        }).catch((error)=>{
            setUploadStatu(3);
            setErr(error);
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
                    updateChannelDate().then(async()=>{
                        //handleRemoveDarft().then(setUploadStatu(1));
                        setUploadStatu(1);
                        if (process.env.NODE_ENV !== "development") {
                            handlePushMessage();
                        }
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
            <Container maxWidth="lg" className={classes.root}>
                <CardContent>
                    <Typography variant="h2" component="h1" gutterBottom>
                        (^ｰ^)ノ<br/>
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
            </Container>
        )
    } else {
        return(
            <Container maxWidth="lg" className={classes.root}>
                <Helmet>
                    <title>新增單集 - Onlymycast</title>
                </Helmet>
                <CardContent>
                <Typography variant="h5" component="h1">發佈單集</Typography>
                <Stepper style={ { background: "none" } } activeStep={activeStep} alternativeLabel>
                    <Step key={0}>
                        <StepLabel>{"錄製方式"}</StepLabel>
                    </Step>
                    <Step key={1}>
                        <StepLabel>{"錄音或選擇音檔"}</StepLabel>
                    </Step>
                    <Step key={2}>
                        <StepLabel>{"單集資訊"}</StepLabel>
                    </Step>
                    <Step key={3}>
                        <StepLabel>{"上傳"}</StepLabel>
                    </Step>
                </Stepper>
                </CardContent>
                <Divider />
                    <CardContent>
                    { activeStep === 0 &&
                    (<>
                        <Button color="primary" variant="outlined" className={classes.mostlarge} 
                        onClick={
                            () => { 
                                selectRecordingType(0);
                                onlineRecordingInit(); 
                                }
                            }>
                        <Typography variant="h4">
                            <MicIcon fontSize="large" />
                            <br/>線上錄製<br/><br/><Divider/><br/>
                            <Typography variant="body1" color="textSecondary">
                                透過網頁直接錄製單集，建議較短或隨性的單集使用此方式。
                            </Typography></Typography><br/><br/><br/>
                        </Button>

                        <Button color="primary" variant="outlined" className={classes.mostlarge} onClick={() => { selectRecordingType(1) }}>
                        <Typography variant="h4">
                            <PublishIcon fontSize="large" />
                            <br/>上傳檔案<br/><br/><Divider/><br/>
                            <Typography variant="body1" color="textSecondary">
                                上傳您後製完成的完整單集，如錄製較長且需剪輯建議使用此方式。
                            </Typography></Typography><br/><br/><br/>
                        </Button>
                    </>)
                    }

                    { (activeStep === 1 && recorderType === 0 ) &&
                    (<>

                    { isBlocked ? 
                    <MuiAlert elevation={6} variant="filled" severity='error'>您沒有安裝麥克風或沒有允許存取，請安裝麥克風或授權網站存取麥克風，才能開始錄製您的節目！</MuiAlert>
                    : 
                    <>
                    <Typography variant="body1">選擇錄音裝置</Typography>
                    <Select
                    disabled={isRecording}
                    variant="outlined"
                    value={recordingDevice}
                    onChange={(e) => { 
                        setRecordingDevice(e.target.value);
                        setMp3Recorder(new MicRecorder({ bitRate: 128, deviceId: e.target.value }));
                     }}
                    >
                    { deviceList }
                    </Select>
                    <br/><br/><Divider/><br/><br/>     
                    <Button disabled={ (deviceList === undefined ? true : false) } color="primary" variant="outlined" className={classes.mostlarge} onClick={handleRecordeingButton}>
                        <Typography variant="h4">
                            { isRecording ? 
                            <>
                            <FiberManualRecordIcon fontSize="large" /><br/>
                            正在錄製⋯⋯<br/>
                            <Typography variant="body1">正在錄製：{currentTime}</Typography>
                            </>
                            : 
                            <>
                            <MicIcon fontSize="large" /><br/>
                            { filename == "" ? "開始錄製" : "重新錄製" }
                            </>
                            }<br/></Typography><br/>
                    </Button>

                    </>
                    }   
                        <br/><br/>
                        {filename !== "" &&<InlinePlayer url={filePath} fileSize={fileBit.size} returnDuration={(value)=>fromPlayerGetDuration(value)}/>}
                        <br/>
                    </>)
                    }

                    { (activeStep === 1 && recorderType === 1 ) &&
                    (<>

                         <input
                            accept=".mp3, .m4a"
                            className={classes.input}
                            id="contained-button-file"
                            multiple
                            type="file"
                            startIcon={<AttachmentIcon />}
                            onChange={(e)=>{
                                if (e.target.files.length >= 1) {
                                    if ( allowFileType.includes(e.target.files[0].type) ) {
                                        setFilename(e.target.files[0].name);
                                        setFileBit(e.target.files[0]);
                                        setFilePath(URL.createObjectURL(e.target.files[0]));
                                    } else {
                                        setErr("檔案格式不支援！");
                                    }
                                }
                            }}
                        />
                        <label htmlFor="contained-button-file">
                            <Button className={classes.mostlarge} variant="contained" size="large" color="primary" component="span">
                                <Typography variant="h5" gutterBottom>
                                <AttachmentIcon fontSize='large' /><br/>
                                { filename === "" ? "選擇檔案" : filename }
                                <br/><br/><Divider/><br/>
                                <Typography variant="body1" gutterBottom>
                                    僅限 MP3 與 M4A 格式檔案<br/>
                                </Typography>
                                </Typography>
                            </Button>
                            <br/>
                        </label>
                        <br/>
                        {filename !== "" &&<InlinePlayer url={filePath} fileSize={fileBit.size} returnDuration={(value)=>fromPlayerGetDuration(value)}/>}
                        <br/>
                    </>)
                    }
    
                { activeStep === 2 &&
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

                { activeStep === 3 &&
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
                    </CardContent>

                <Divider />
                    <CardContent>
                    <CardActions disableSpacing className={ classes.flexRight }>
                    {
                    //按鈕 
                        activeStep < 3 &&
                        <>
                            <Button
                                    disabled={activeStep === 0}
                                    onClick={()=>setActiveStep(activeStep - 1)}
                                    className={ classes.flexLeft }
                                >
                                    上一步
                                </Button>
                                {activeStep === 2 ? 
                                <>
                                    <Tooltip className={classes.backButton} onClick={handleSaveDarft} title="存入草稿後，仍可變更檔案但不可線上錄製" aria-label="save">
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            className={classes.button}
                                            startIcon={ handleDarftCode==='loading'? <CircularProgress size={24} className={classes.buttonProgress} /> : <SaveIcon />}
                                            disabled={handleDarftCode==="loading"}
                                            >
                                            儲存草稿
                                        </Button>
                                    </Tooltip>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        onClick={()=>handleUploadPodcast()}
                                        >
                                        完成並發布
                                    </Button>
                                </>
                                :
                                <Button disabled={ (activeStep===0) || (filename==="" && activeStep===1) || (podcastTitle===""&& activeStep===2) || (intro==="" && activeStep===3) } variant="contained" color="primary" onClick={()=>setActiveStep(activeStep + 1)}>
                                    下一步
                                </Button>
                                }
                        </>
                    }
                    </CardActions>                   
                    </CardContent>

                <Dialog
                    open={introErr !== false || titleErr !== false || err !== false}
                    onClose={()=>{setIntroErr(false);setTitleErr(false);setErr(false)}}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"提示"}</DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {introErr}<br/>{titleErr} {err}
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={()=>{setIntroErr(false); setTitleErr(false); setErr(false);}} color="primary" autoFocus>
                        好
                    </Button>
                    </DialogActions>
                </Dialog>
                <Snackbar open={handleDarftCode==="suc"} autoHideDuration={2000} onClose={()=>{setHandleDarftCode('init')}} message="您的草稿已經儲存"/>
                <Snackbar open={handleDarftCode==="get"} onClose={()=>{setHandleDarftCode('fin')}} autoHideDuration={2000} message="您的草稿已經還原"/>
            </Container>
        );
    
    }
}
export default NewPodcast;
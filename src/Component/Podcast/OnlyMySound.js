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
import { Grid } from '@material-ui/core';
//custom
import LinearProgressWithLabel from '../CustomComponent/LinearProgressWithLabel';
//compoment
import NotCreatePodcast from './NotCreatePodcast';
//firebase
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/functions";
//other
import { Helmet } from 'react-helmet';
import genrssfeed from '../../Functions/genRssfeed';
//uuidv4
import { v4 as uuidv4 } from 'uuid';
//socket.io
import { io } from 'socket.io-client';

const useStyles = makeStyles((theme)=>({
    root: {
        minWidth: 275,
        marginTop: 100,
        borderRadius: "10px",
        alignItems:"center",
    },
    centered: {
        textAlign: "center",
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
    },
  })
  );


  const NewPodcast = (props) => {

    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const [filename, setFilename] = useState("");
    const [filePath, setFilePath] = useState();
    const [fileBit, setFileBit] = useState();

    //var fileArray = useRef(new Array());
    //const [fileUiArray, setFileUiArray] = useState(new Array());

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

    const roomHashCode = useRef("");
    const socket = useRef();
    
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
                onlineRecordingInit(); 
                isFirstLoad.current = false;
            }
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

    const handleRecordeingButton = () => {
        if (!isRecording) {
            start();
        } else {
            stop();
        }
    }

    const GenRoom = async() => {
        roomHashCode.current = uuidv4();
        socket.current = io(props.socketUrl + "?room=" + roomHashCode.current, { withCredentials : true });
    }
    
    const start = async() => {
        if (isBlocked) {
          console.log('Permission Denied');
        } else {
            await GenRoom();
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

            /*console.log(fileArray.current.push(
                {url : blobURL, data: blob, filename: sha256(new Date().toISOString()).toString() + '.mp3'}
                ));

            setFileUiArray(
                [...fileUiArray, 
                <InlinePlayer 
                    key={fileUiArray.length + 1} 
                    url={blobURL} 
                    fileSize={blob.size} 
                    returnDuration={(value)=>fromPlayerGetDuration(value)}/>            
                ]
            )*/

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

    const updateChannelDate = async()=>{
        await firebase.firestore().collection("channel").doc(props.user.userId).set({
            updateTime:firebase.firestore.FieldValue.serverTimestamp(),
            uid:props.userUid
        }, { merge: true }).then((event)=>{

            //rss產生
            genrssfeed(props.user.userId, props.userEmail, props.baseWwwUrl);
            
        }).catch((error)=>{
            setUploadStatu(3);
            setErr(error);
        })
    }

    if (props.user.userId==="") {
        return(
            <NotCreatePodcast/>
        )
    } else {
        return(
            <Container maxWidth="lg" className={classes.root}>
                <Helmet>
                    <title>傾訴空間 - Onlymycast</title>
                </Helmet>   

                <Grid container spacing={2}>
                    <Grid item xs={12} md={7}>
                        <Typography variant="h3">傾訴空間</Typography> 
                    </Grid>
                </Grid>
                <br/><Divider/><br/>
        
                <div className={ classes.centered }>
                    <>
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
                            { filename == "" ? "開始錄製" : "停止" }
                            </>
                            }<br/></Typography><br/>
                    </Button>

                    </>
                    }   
                        <br/><br/>
                        {//fileUiArray
                        }

                        {filename !== "" &&<InlinePlayer url={filePath} fileSize={fileBit.size} returnDuration={(value)=>fromPlayerGetDuration(value)}/>
                        }
                        <br/>
                    </>
                </div>

                    
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
            </Container>
        );
    }
}
export default NewPodcast;
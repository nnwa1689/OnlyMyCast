//react
import React, { useState } from 'react'
import { Redirect } from 'react-router-dom';
import { Link as RLink, useHistory } from 'react-router-dom';
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
//firebase
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const useStyles = makeStyles((theme)=>({
    root: {
      minWidth: 275,
      marginTop: 100,
      marginBottom: 150
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
    const [uploadStatu, setUploadStatu] = useState(0);
    //0:init 1:suc 2:uploading 3:err
    let audioFileRef = "";

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

    const uploadAudioFile = async()=> {
        //upload
        const hashFilename = sha256(filename);
        const fileRef = 'podcastaudio/' + props.user.userId + "/" + hashFilename + ".mp3";
        audioFileRef = fileRef;
        var storageRef = firebase.storage().ref().child(fileRef);
        return new Promise(async(resole, reject)=>{
            await storageRef.put(fileBit).then(async(s) => {
            storageRef.getDownloadURL()
            .then(async(url) => {
                resole(url);
            })
        });
        }) 
    }

    const updateChannelDate = async()=>{
        await firebase.firestore().collection("channel").doc(props.user.userId).set({
            updateTime:firebase.firestore.FieldValue.serverTimestamp(),
            uid:props.userUid
        }, { merge: true }).then((event)=>{

        }).catch((error)=>{

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
                await firebase.firestore().collection("podcast").doc(props.user.userId).collection("podcast").add({
                    url: url,
                    intro:intro,
                    title: podcastTitle,
                    updateTime:firebase.firestore.FieldValue.serverTimestamp(),
                    uid:props.userUid,
                    fileRef:audioFileRef
                }, { merge: true }).then((event)=>{
                    updateChannelDate().then(setUploadStatu(1))
                }).catch((error)=>{
        
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
                    <Typography variant="h5" component="h1">新增單集</Typography>
                    <Typography variant="body1" component="span">依照步驟來新增您電台的單集</Typography>
                    
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
                            accept=".mp3"
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
                        {filename !== "" &&<InlinePlayer url={filePath} fileSize={fileBit.size}/>}
                        <br/>
                        <label htmlFor="contained-button-file">
                            <Button variant="contained" size="large" color="primary" component="span">
                                <AttachmentIcon />
                                { filename === "" ? "選擇檔案" : filename }</Button>
                                <br/><br/>
                                <Typography variant="body1" gutterBottom>
                                    僅限 mp3 格式  
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
                            <InputLabel>電台簡介</InputLabel>
                                <OutlinedInput id="component-outlined" value="falksjd" style={{display:"none"}}/>
                                <br/>
                                <MDEditor
                                    value={intro}
                                    onChange={setIntro}
                                />   
                                <br/> <br/>                                   
                            </FormControl>    
                        </>
                    )
                     }
    
                    { activeStep === 2 &&
                    (
                        <>
                            <Typography variant="h1" gutterBottom>
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
                            <CircularProgress size={80} />
                            <Typography variant="h6" gutterBottom>
                                正在處理上傳作業，請稍候！ <br/>不要離開頁面唷(＞^ω^＜)
                            </Typography>
                        </>
                    }
    
                    { //uploading
                        uploadStatu === 2 && 
                        <>
                            <CircularProgress size={80} />
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
                            <Button variant="contained" color="primary" onClick={()=>handleUploadPodcast()}>
                                完成
                            </Button>
                            :
                            <Button disabled={ (filename==="" && activeStep===0) || (podcastTitle===""&& activeStep===1) || (intro==="" && activeStep===1) } variant="contained" color="primary" onClick={()=>setActiveStep(activeStep + 1)}>
                                下一步
                            </Button>
                            }
                        </>
                    }
                    </CardContent>
                </Card>
            </Container>
        );
    
    }
}
export default NewPodcast;
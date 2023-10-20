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
        margin:theme.spacing(4),
    },
  })
  );


  const PlayOnlyMySound = (props) => {

    const classes = useStyles();
    const [liveclose, setLiveClose] = useState();
    const [roomCount, setRoomCount] = useState(0);
    //var fileArray = useRef(new Array());
    //const [fileUiArray, setFileUiArray] = useState(new Array());
    const [titleErr, setTitleErr] = useState(false);
    const [introErr, setIntroErr] = useState(false);
    const [err, setErr] = useState(false);
    const isFirstLoad = useRef(true);

    const roomHashCode = useRef("");
    const socket = useRef();
    
    const mediaSource = new MediaSource();

    const [isRecording, setIsRecording] = useState(false);
    let currentTimer;
    let sendAudioSocketTimer;

    useEffect(
        ()=>{
            if (isFirstLoad.current) {
                window.scrollTo(0, 0);
                liveRoomInit(); 
                isFirstLoad.current = false;
            }
        }
    )


    const liveRoomInit = async() => {
        JoinRoom();
    }

    const handleRecordeingButton = () => {
        if (!isRecording) {
            start();
        } else {
            stop();
        }
    }

    const JoinRoom = () => {
        //roomHashCode.current = uuidv4();
        socket.current = io(props.socketUrl, 
            {   withCredentials : true,
                query : {
                    "room" : "123456",
                    "isHost" : "false"
                }
            }
        );

        mediaSource.onsourceopen = _ => {
            const sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg");
            socket.current.on("sentplayer", (buf) => {
                sourceBuffer.appendBuffer(buf);
                //console.log(buf);
            });
        }

        socket.current.on("hello", (msg) => {
            //Test Msg
            //console.log(msg);
        });

        socket.current.on("liveclose", (msg) => {
            setLiveClose(msg);
        });

        socket.current.on("personUpdate", (msg) => {
            setRoomCount(msg);
        });

        socket.current.on("disconnect", (msg) => {
            setLiveClose("true");
        });
    }
    
    const start = async() => {
    }

    const stop = () => {
      }


    if (false) {
        //pass
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
                    {
                        liveclose === "true"
                        ?
                        <>
                            <Button color="primary" variant="outlined" className={classes.mostlarge} disabled>
                                <Typography variant="h4">
                                    <FiberManualRecordIcon fontSize="large" /><br/>
                                    直播已結束
                                </Typography>
                            </Button> 
                        </> 
                        :
                        <>
                            <audio src={ URL.createObjectURL(mediaSource) } controls></audio>
                            <Button color="primary" variant="outlined" className={classes.mostlarge}>
                                <Typography variant="h4">
                                    <FiberManualRecordIcon fontSize="large" /><br/>
                                    聲音直播中
                                    <br/>
                                    線上人數：{ roomCount }
                                </Typography>
                            </Button> 
                            <br/><Divider/><br/>
                            <Button color="primary" variant="contained"  fullWidth onClick={handleRecordeingButton}>
                                <Typography variant="h4">
                                    <FiberManualRecordIcon fontSize="large" />
                                    離開
                                    <br/>
                                </Typography>
                            </Button>
                        </>
                    }
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
export default PlayOnlyMySound;
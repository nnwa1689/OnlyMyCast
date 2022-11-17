//react
import React, { useState, useEffect, useRef } from 'react'
import { Redirect } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import InlinePlayer from '../Player/InlinePlayer';
//ui
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import AttachmentIcon from '@material-ui/icons/Attachment';
import PublishIcon from '@material-ui/icons/Publish';
//custom
import LinearProgressWithLabel from '../CustomComponent/LinearProgressWithLabel';
//firebase
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/database";
import "firebase/functions";
//other
import { Helmet } from 'react-helmet';
import genrssfeed from '../../Functions/genRssfeed';

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
    button: {
        margin:theme.spacing(1)
    },
    flexLeft: {
        marginRight: "auto",
    },
    flexRight: {
        display: "flex",
        justifyContent: "flex-end"
    },
  })
  );

  const EditCastDarft = (props) => {

    const classes = useStyles();
    const [title, setTitle] = useState();
    const [intro, setIntro] = useState();
    const [showDelMsgBox, setshowDelMsgBox] = useState(false);
    const [showPublishMsgBox, setShowPublishMsgBox] = useState(false);
    const [handleCode, setHandleCode] = useState("init");
    const [titleErr, setTitleErr] = useState(false);
    const [introErr, setIntroErr] = useState(false);
    //0:init 1:suc 2:loading 3:err
    const isFirstLoad = useRef(true);

    const audioFileRef = useRef("");
    const [filename, setFilename] = useState("");
    const [filePath, setFilePath] = useState();
    const [fileBit, setFileBit] = useState();
    const [uploadProgress, setUploadProgres] = useState();
    const [err, setErr] = useState(false);
    const duration = useRef("");

    const allowFileType = [
        'audio/mpeg', 'audio/x-m4a', 'audio/mp3'
    ];

    useEffect(
        ()=>{
            if (isFirstLoad.current) {
                getSPData();
                window.scrollTo(0, 0);
                isFirstLoad.current = false;
            }
        }
    )

    const fromPlayerGetDuration = (value) => {
        duration.current = parseInt(value/60, 10) + ":" + Math.ceil(parseInt(value, 10)%60);
   }

    const handleDelPodcast = () => {
        setshowDelMsgBox(false);
        setHandleCode("del");
        firebase.firestore()
        .collection("podcast")
        .doc(props.user.userId)
        .collection('castdarft')
        .doc(props.match.params.podId)
        .delete()
        .then(()=>{
            //delFile
            firebase.storage()
            .ref()
            .child(audioFileRef.current)
            .delete()
            .then(
                ()=>{setHandleCode("delSuc")
            });
        }
        )
    }

    const uploadAudioFile = async()=> {
        //upload
        const fileRef = audioFileRef.current;
        var storageRef = firebase.storage().ref().child(fileRef);
        return new Promise(async(resole, reject)=>{
            var uploadTask = storageRef.put(fileBit);
            uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setUploadProgres(progress);
            },(error)=>{setErr(error)});
            uploadTask.then((s) => {
            storageRef.getDownloadURL()
            .then(async(url) => {
                resole(url);
            });
        });
        }) 
    }

    const updateDarft = (url) => {
        firebase.firestore()
        .collection("podcast")
        .doc(props.user.userId)
        .collection('castdarft')
        .doc(props.match.params.podId)
        .set(
            {
                title:title,
                intro:intro,
                url:url
            }, { merge: true }
        ).then((doc)=>{
            setHandleCode("suc");
        });
    }

    const handleUpdateInfor = () =>{
        setHandleCode("updateDarft"); setTitleErr(false); setIntroErr(false);
        if (title !== "" && intro !== "") {
            //更新草稿音訊檔案
            if (filename !== "") {
                uploadAudioFile()
                .then(
                    (url) => {
                        updateDarft(url);
                        setFilePath(url);
                    }
                );
            } else {
                updateDarft(filePath);
            }

        } else {
            setHandleCode("error")
            if (title==="") {
                setTitleErr("單集名稱不能為空");
            }
            if (intro==="") {
                setIntroErr("單集介紹不能為空");
            }
        }
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
            genrssfeed(props.user.userId, props.userEmail);
        }).catch((error)=>{
            setErr(error);
        })
    }

    const uploadPodcast = (url) => {
        firebase.firestore().collection("podcast").doc(props.user.userId).collection("podcast").add({
            url: url,
            intro:intro,
            title: title,
            updateTime:firebase.firestore.FieldValue.serverTimestamp(),
            uid:props.userUid,
            fileRef:audioFileRef.current,
            duration:duration.current
        }, { merge: true }).then((event)=>{
            updateChannelDate().then(async()=>{
                firebase.firestore()
                .collection("podcast")
                .doc(props.user.userId)
                .collection('castdarft')
                .doc(props.match.params.podId)
                .delete()
                .then(
                    async() => {
                        if (process.env.NODE_ENV !== "development") {
                            handlePushMessage();
                        }
                        setHandleCode("publishSuc");
                    }
                )
            }
        )
        }).catch((error)=>{
            setErr(error);
        });
    } 

    const publishPodcast = async() => {
        setShowPublishMsgBox(false);
        if (title==="" || intro==="") {
            if (title==="") {
                setTitleErr("單集標題不能為空");
            }
            if (intro==="") {
                setIntroErr("單集介紹不能為空");
            }
        } else {
            setHandleCode("publish");
            if (filename !== "") {
                await uploadAudioFile()
                .then(
                    (url) => {
                        uploadPodcast(url);
                    }
                )
            } else {
                uploadPodcast(filePath);
            }
        }
    }

    const getSPData = ()=>{
        firebase.firestore()
        .collection("podcast")
        .doc(props.user.userId)
        .collection('castdarft')
        .doc(props.match.params.podId)
        .get()
        .then((doc)=>{
            const data = doc.data();
            if (data===undefined) {

            } else if (Object.entries(data).length===0) {

            } else {
                setTitle(data.title);
                setIntro(data.intro);
                setFilePath(data.url);
                audioFileRef.current = data.fileRef;
            }
        })
      }

    if (title===undefined || intro===undefined) {
        return(<CircularProgress style={{marginTop: "25%"}} />);
    } else {
        return(
            <Container maxWidth="lg" className={classes.root}>
                <Helmet>
                    <title>編輯草稿 - Onlymycast</title>
                </Helmet>
                <CardContent>
                <Typography variant="h5" component="h1">編輯草稿</Typography>
                <Typography variant="body1" component="span">刪除或編輯這個草稿</Typography>
                <br/>
                    <FormControl fullWidth className={classes.margin}>
                        <TextField error={titleErr!==false} helperText={ titleErr !== false && titleErr} disabled={handleCode==="loading"} value={title} onChange={(e)=>setTitle(e.target.value)} id="outlined-basic" label="單集標題" variant="outlined" />
                    </FormControl>
                    <FormControl fullWidth className={classes.margin}>
                    <InputLabel>單集簡介</InputLabel>
                        <OutlinedInput id="component-outlined" value="." style={{display:"none"}}/>
                        <br/>
                        <MDEditor
                            value={intro}
                            onChange={setIntro}
                        />   
                        <br/>                       
                    </FormControl>
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
                    <Button fullWidth variant="contained" size="large" color="primary" component="span">
                        <Typography variant="h6" gutterBottom>
                        <AttachmentIcon/>
                        { filename === "" ? "變更檔案" : filename }
                        <br/>
                        <Typography variant="body2" gutterBottom>
                            僅限 MP3/MP4/M4A 格式
                        </Typography>
                        </Typography>
                    </Button>
                    <br/>
                    </label>
                    <br/>
                    <InlinePlayer url={filePath} fileSize={""} returnDuration={(value)=>fromPlayerGetDuration(value)}/>
                    
                    <FormControl fullWidth className={classes.margin}>
                        {
                            filename !== "" && ( handleCode === "updateDarft" || handleCode === "publish" ) ?
                            <>
                                <br/>
                                <LinearProgressWithLabel value={uploadProgress} />
                                <br/>
                                <Typography variant="h6" gutterBottom>
                                    正在處理上傳作業，請不要關閉視窗。
                                </Typography>
                                <br/>
                            </>
                            :
                            ""
                        }
        
                        {  //uploadErr
                            err && 
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
                    </FormControl>
                    <Divider />
                    <CardContent>
                        <CardActions disableSpacing className={ classes.flexRight }>
                            <Button
                                variant="contained"
                                color="secondary"
                                className={ classes.flexLeft }
                                startIcon={<DeleteIcon />}
                                onClick={()=>{setshowDelMsgBox(true)}}
                                disabled={handleCode === "updateDarft" || handleCode === "publish" || handleCode === "del"}
                            >
                                刪除
                            </Button>

                            <Button
                                variant="outlined"
                                color="primary"
                                className={classes.backButton}
                                startIcon={ handleCode==='updateDarft'? <CircularProgress size={24} className={classes.buttonProgress} /> : <SaveIcon />}
                                onClick={handleUpdateInfor}
                                disabled={handleCode === "updateDarft" || handleCode === "publish" || handleCode === "del"}
                            >
                                儲存
                            </Button>

                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.flexRight}
                                startIcon={ handleCode==='publish'? <CircularProgress size={24} className={classes.buttonProgress} /> : <PublishIcon />}
                                onClick={() => { setShowPublishMsgBox(true) }}
                                disabled={handleCode === "updateDarft" || handleCode === "publish" || handleCode === "del"}
                            >
                                發布
                            </Button>
                        </CardActions>
                    </CardContent>
                </CardContent>

                <Dialog
                    open={showPublishMsgBox}
                    onClose={()=>{setShowPublishMsgBox(false)}}
                >
                    <DialogTitle>發佈單集</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        確定將這個草稿發佈成為單集嗎？<br/>發佈後就不能恢復為草稿及替換檔案。
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={()=>{setShowPublishMsgBox(false)}} color="primary" autoFocus>
                        取消
                    </Button>
                    <Button onClick={publishPodcast} color="primary">
                        確定
                    </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={showDelMsgBox}
                    onClose={()=>{setshowDelMsgBox(false)}}
                >
                    <DialogTitle>刪除單集</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        確定刪除這個草稿嗎？<br/>刪除後不可還原。
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={()=>{setshowDelMsgBox(false)}} color="primary" autoFocus>
                        取消
                    </Button>
                    <Button onClick={handleDelPodcast} color="primary">
                        確定
                    </Button>
                    </DialogActions>
                </Dialog>
                <Snackbar open={handleCode==="suc"} autoHideDuration={6000} onClose={()=>{setHandleCode("init")}} message="您的變更已經儲存"/>
                { (handleCode==="delSuc" || handleCode === "publishSuc") && <Redirect to='/editpodcasts'/> }
                <Dialog
                    open={introErr!==false || titleErr!==false || err !== false}
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
export default EditCastDarft;
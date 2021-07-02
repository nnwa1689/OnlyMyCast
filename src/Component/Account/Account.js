import React, { useState, useEffect, useRef } from 'react'
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import { deepOrange } from '@material-ui/core/colors';
import AttachmentIcon from '@material-ui/icons/Attachment';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DeleteIcon from '@material-ui/icons/Delete';

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";


const useStyles = makeStyles((theme)=>({
    root: {
        minWidth: 275,
        marginTop: 100,
        marginBottom: 150,
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

const Account = (props) => {
    const classes = useStyles();
    const [handleCode, setHandleCode] = useState('init');
    const [name, setName] = useState(props.user.name);
    const [avatar,setAvatar] = useState(props.user.avatar);
    const [newPassword, setNewPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [filename, setFilename] = useState("");
    const [fileBit, setFileBit] = useState();
    const [nameErr, setNameErr] = useState(false);
    const [oldPwErr, setOldPwErr] = useState(false);
    const [newPwErr, setNewPwErr] = useState(false);
    const [showUnsubMsg, setShowUnsubMsg] = useState(false);
    const [subscribeList, setSubscribeList] = useState();
    const willUnsubId = useRef("");
    const isFirstLoad = useRef(true);
    const [loaded, setLoaded] = useState(false);


    const genListItem = async(data)=>{
        var changeArr = Array();
        for (var value of Object.entries(data)) {
            await firebase.firestore().collection("channel").doc(value[0]).get()
            .then((doc)=>{
                var data = doc.data();
                changeArr.push(
                    <ListItem key={value[0]}>
                        <ListItemAvatar>
                        <Avatar variant="rounded" alt={data.name} src={data.icon}/>
                        </ListItemAvatar>
                        <ListItemText
                            primary={data.name}
                        />
                        <ListItemSecondaryAction>
                        <IconButton
                            variant="contained"
                            color="secondary"
                            value={value[0]}
                            onClick={(e)=>{showUnSubMsgBox(e)}}
                            className={classes.button}>
                                <DeleteIcon />
                        </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                )
            })
        }
        return changeArr;
    }

    const getSubscribe = ()=>{
        firebase.firestore().collection("subscribe").doc(props.userUid).get()
        .then((doc)=>{      
            if (doc.exists) {
                if (Object.entries(doc.data()).length === 0) {
                    setSubscribeList("")
                } else {
                    genListItem(doc.data()).then((arr)=>(setSubscribeList(arr)))
                }
 
            } else {
                setSubscribeList("");
            }
            setLoaded(true);
          }
        );
    }

    useEffect(
        ()=>{
            if (isFirstLoad.current) {
                getSubscribe();
                isFirstLoad.current = false;
            }
        }
    )

    const handleUpdateAccount = ()=>{
        setHandleCode('loading');
        setNameErr(false);
        setOldPwErr(false);
        setNewPwErr(false);
        if (name==="" || oldPassword==="") {
            if (name==="")
                setNameErr("暱稱不可為空");
            if (oldPassword==="")
                setOldPwErr("舊密碼不可為空");
            setHandleCode('error');
        } else {
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                  var credential = firebase.auth.EmailAuthProvider.credential(user.email, oldPassword);
                  user.reauthenticateWithCredential(credential).then(()=> {
                      
                        if (newPassword!=="") {
                            user.updatePassword(newPassword).then(()=>{
                                // 修改密碼完成
                    
                            }).catch((error)=> {
                                if (error.code==="auth/weak-password") {
                                    setNewPwErr("密碼必須大於6位數");
                                    setHandleCode('error')
                                }
                            });
                        }
         
                        if (filename !== "") {
                            //uploadAvatar
                            var storageRef = firebase.storage().ref().child('avatar/' + user.uid + "/" + filename);
                            storageRef.put(fileBit).then((s) => {
                                storageRef.getDownloadURL()
                                .then((url) => {
                                    setAvatar(url);
                                    firebase.firestore().collection("user").doc(user.uid).set({
                                        avatar:url
                                    }, { merge: true })
                                })
                            });
                        }

                        firebase.firestore().collection("user").doc(user.uid).set({
                            name: name,
                        }, { merge: true }).then(
                            ()=>{
                                setHandleCode('suc');
                                setFilename("");
                                setFileBit();
                                setOldPassword("");
                                setNewPassword("");
                            }
                        )

                  }).catch((error)=>{
                      setOldPwErr("舊密碼錯誤");
                      setHandleCode('error');
                  });
                } else {
                  // User is signed out
                  // ...
                }
              });
        }
    }

    const showUnSubMsgBox = (e) =>{
        setShowUnsubMsg(true);
        willUnsubId.current = e.currentTarget.value;
    }

    const handelUnSub = (e)=>{
        setShowUnsubMsg(false);
        firebase.firestore().collection("subscribe").doc(props.userUid).update(
            {[willUnsubId.current] : firebase.firestore.FieldValue.delete()}
        ).then(
            firebase.firestore().collection("fans").doc(willUnsubId.current).update(
                {[props.userUid] : firebase.firestore.FieldValue.delete()}
            ).then(
                ()=>{ getSubscribe();}
            )  
        )
    }


    if (!loaded || subscribeList===undefined){
        return(<CircularProgress style={{marginTop: "25%"}} />);
    } else {
        return(
            <Container maxWidth="sm">
                <Card className={classes.root}>
                    <CardContent>
                    <Typography variant="h5" component="h1">帳號設定</Typography>
                    <Typography variant="body1" component="span">更新您的個人資訊<br/>這裡的資訊將用於您訂閱他人時顯示</Typography>
                    <Avatar alt={name} src={avatar} className={classes.large} />
                    <form noValidate autoComplete="off">
                        <FormControl fullWidth className={classes.margin}>
                        <input
                            accept="image/*"
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
                            <Button variant="contained" size="large" fullWidth color="primary" component="span">
                                <AttachmentIcon />
                                { filename === "" ? "上傳新頭貼" : filename }</Button>
                        </label>
                        </FormControl>
                        <FormControl fullWidth className={classes.margin}>
                            <TextField disabled={handleCode==="loading"} error={ nameErr!==false } helperText={ nameErr!==false && (nameErr) } value={name} onChange={(e)=>setName(e.target.value)} id="outlined-basic" label="暱稱" variant="outlined" />
                        </FormControl>
                        <Divider/>
                        <Typography variant="h5" component="h1"><br/>帳號安全</Typography>
                        <Typography variant="body1" component="span">更新、驗證您的密碼</Typography>
                        <FormControl fullWidth className={classes.margin}>
                            <TextField disabled={handleCode==="loading"} error={newPwErr!==false} helperText={ newPwErr!==false ? newPwErr : "如果不要變更密碼，此欄留空"} type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} id="outlined-basic" label="新密碼" variant="outlined" />
                        </FormControl>
                        <FormControl fullWidth className={classes.margin}>
                            <TextField disabled={handleCode==="loading"} error={oldPwErr!==false} helperText={oldPwErr!==false && (oldPwErr)} type="password" value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)} id="outlined-basic" label="確認舊密碼" variant="outlined" />
                        </FormControl>
                    </form>
                    <div className={classes.wrapper}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            className={classes.button}
                            startIcon={ handleCode==='loading'? <CircularProgress size={24} className={classes.buttonProgress} /> : <SaveIcon />}
                            onClick={handleUpdateAccount}
                            disabled={handleCode==="loading"}>
                            儲存設定
                        </Button>
                    </div>
                    <br/><br/>
                    <Divider/>

                    { subscribeList !== "" ? 
                    <>
                        <Typography variant="h5" component="h1"><br/>訂閱管理</Typography>
                        <Typography variant="body1" component="span">取消已經訂閱的頻道</Typography>
                        <List dense>
                            {  subscribeList }
        
                        </List>
                    </>
                    :
                    <Typography variant="h4" component="h1"><br/>╮(╯▽╰)╭<br/>目前沒有任何訂閱！<br/>快去訂閱喜歡的頻道吧！</Typography>
                    }
                
    
                    <div>
                        <Dialog
                            open={showUnsubMsg}
                            onClose={()=>{setShowUnsubMsg(false)}}
                        >
                            <DialogTitle>取消訂閱</DialogTitle>
                            <DialogContent>
                            <DialogContentText>
                                確定要取消"{willUnsubId.current}"的訂閱嗎？<br/>移除後您必須重新追蹤才能再收聽該頻道。
                            </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={()=>{setShowUnsubMsg(false)}} color="primary" autoFocus>
                                取消
                            </Button>
                            <Button onClick={handelUnSub} color="primary">
                                確定
                            </Button>
                            </DialogActions>
                        </Dialog>
                        </div>
                    </CardContent>
                </Card>
                <Snackbar open={handleCode==="suc"} autoHideDuration={6000} onClose={props.dataupdate} message="您的變更已經儲存"/>
            </Container>
        );
    
    }
}
export default Account;
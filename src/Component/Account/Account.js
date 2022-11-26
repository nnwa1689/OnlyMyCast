//react
import React, { useState, useEffect, useRef } from 'react'
import { Link as RLink } from 'react-router-dom';
//googleUi
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
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
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DeleteIcon from '@material-ui/icons/Delete';
import Link from '@material-ui/core/Link';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import SwipeableViews from 'react-swipeable-views';
import Grid from '@mui/material/Grid';
import LockIcon from '@material-ui/icons/Lock';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import AssignmentIndRoundedIcon from '@material-ui/icons/AssignmentIndRounded';
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
      width: theme.spacing(30),
      height: theme.spacing(30),
      marginBottom: theme.spacing(3),
      marginTop:theme.spacing(3),
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
    button: {
        margin: "10px"
    },
    flexLeft: {
        marginRight: "auto",
    },
    flexRight: {
        display: "flex",
        justifyContent: "flex-end"
    },
  }));

  const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <div p={0}>
            {children}
          </div>
        )}
      </div>
    );
  }

const Account = (props) => {
    const classes = useStyles();
    const [handleCode, setHandleCode] = useState('init');
    const [name, setName] = useState(props.user.name);
    const theme = useTheme();
    const [avatar,setAvatar] = useState(props.user.avatar==="" ?"." : props.user.avatar);
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
    const [updatePassword, setUpdatePassword] = useState(false);



    const [tabValue, setTabValue] = useState(0);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
      };
    
    const handleChangeIndex = (index) => {
        setTabValue(index);
    };

    const handleLogout = () => {
        firebase.auth().signOut().then(() => {
            // Sign-out successful.
            window.location.reload();
          }).catch((error) => {
            console.log("發生一些問題QAQ");
          });
    }

    const genListItem = async(data)=>{
        var changeArr = Array();
        for (var value of Object.entries(data)) {
            await firebase.firestore().collection("channel").doc(value[0]).get()
            .then((doc)=>{
                var data = doc.data();
                changeArr.push(
                    <ListItem key={value[0]}>
                        <ListItemAvatar>
                        <Avatar style={ {backgroundColor: "#FD3E49",} } variant="rounded" alt={data.name} src={data.icon}/>
                        </ListItemAvatar>
                        <Link variant="body1" component={RLink} to={"/podcast/" + value[0]}>
                            {data.name}
                        </Link>
                        <ListItemSecondaryAction>
                        <IconButton
                            variant="contained"
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
        try{
            firebase.firestore().collection("subscribe").doc(props.userUid).get()
            .then((doc)=>{      
                if (doc.exists) {
                    if (Object.entries(doc.data()).length === 0) {
                        setSubscribeList("");
                    } else {
                        genListItem(doc.data()).then((arr)=>(setSubscribeList(arr)));
                    }
     
                } else {
                    setSubscribeList("");
                }
                setLoaded(true);
              }
            );
        }catch{
            //
        }
    }

    useEffect(
        ()=>{
            if (isFirstLoad.current) {
                getSubscribe();
                window.scrollTo(0, 0);
                isFirstLoad.current = false;
            }
        }
    )

    const handleUpdateAccount = ()=>{
        setHandleCode('loading');
        setNameErr(false);
        setOldPwErr(false);
        setNewPwErr(false);
        if (name==="" || (oldPassword==="" && props.googleSing === false)) {
            if (name==="")
                setNameErr("暱稱不可為空");
            if (oldPassword==="" && props.googleSing === false)
                setOldPwErr("舊密碼不可為空");
            setHandleCode('error');
        } else {
            firebase.auth().onAuthStateChanged(async(user) => {
                if (user) {
                    //Google
                    if (props.googleSing) {
                        if (filename !== "") {
                            //uploadAvatar
                            var storageRef = firebase.storage().ref().child('avatar/' + user.uid + "/" + filename);
                            await storageRef.put(fileBit).then((s) => {
                                storageRef.getDownloadURL()
                                .then((url) => {
                                    setAvatar(url);
                                    firebase.firestore().collection("user").doc(user.uid).set({
                                        avatar:url
                                    }, { merge: true })
                                })
                            }).catch(
                                (e)=>{}
                            );
                        }
                        await firebase.firestore().collection("user").doc(user.uid).set({
                            name: name,
                        }, { merge: true }).then(
                            ()=>{
                                setHandleCode('suc');
                                setFilename("");
                                setFileBit();
                            }
                        )
                    } else {
                        var credential = firebase.auth.EmailAuthProvider.credential(user.email, oldPassword);
                        user.reauthenticateWithCredential(credential).then(()=> {
                              if (newPassword !== "") {
                                  user.updatePassword(newPassword).then(async()=>{
                                      // 修改密碼完成
                                      if (filename !== "") {
                                          //uploadAvatar
                                          var storageRef = firebase.storage().ref().child('avatar/' + user.uid + "/" + filename);
                                          await storageRef.put(fileBit).then((s) => {
                                              storageRef.getDownloadURL()
                                              .then((url) => {
                                                  setAvatar(url);
                                                  firebase.firestore().collection("user").doc(user.uid).set({
                                                      avatar:url
                                                  }, { merge: true })
                                              })
                                          }).catch(
                                              (e)=>{}
                                          );
                                      }
              
                                      await firebase.firestore().collection("user").doc(user.uid).set({
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
                                  }).then(
                                      () => {
                                          // 重新驗證用戶(登出)，使用者點選確認後登出帳戶
                                          setUpdatePassword(true);
                                      }
                                  )
                                  .catch((error)=> {
                                      if (error.code==="auth/weak-password") {
                                          setNewPwErr("密碼必須大於6位數");
                                          setHandleCode('error');
                                      }
                                  });
                              } else {
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
                                      }).catch(
                                          (e)=>{}
                                      );
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
                              }
               
                        }).catch((error)=>{
                            setOldPwErr("舊密碼錯誤");
                            setHandleCode('error');
                        });
                    }

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
            <Container maxWidth="lg" className={classes.root}>
            <Helmet>
                <title>個人設定 - Onlymycast</title>
            </Helmet>
                    <AppBar className={classes.tabBar} position="static" color="default">
                        <Tabs
                        value={tabValue}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                        >
                        <Tab label="帳號與密碼" />
                        <Tab label="訂閱管理" />
                        </Tabs>
                    </AppBar>
                    <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={tabValue}
                    onChangeIndex={handleChangeIndex}>
                        <TabPanel value={tabValue} index={0}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                <CardContent>
                                    <Typography variant="h5" component="h1"><AccountCircleIcon/>頭貼設定</Typography>
                                    <Avatar alt={name} src={avatar} className={classes.large} />
                                        <FormControl fullWidth className={classes.margin}>
                                        <input
                                            accept="image/jpeg, image/png"
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
                                            <Button variant="contained" size="large" fullWidth color="primary" component="span">
                                                <AttachmentIcon />
                                                { filename === "" ? "上傳新頭貼" : filename }
                                            </Button>
                                            <Typography variant="body2" component="span">只能上傳.jpg/.jpeg/.png</Typography>
                                        </label>
                                        </FormControl>
                                    </CardContent>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <CardContent>
                                    <Typography variant="h5" component="h1"><AssignmentIndIcon/>帳號資訊</Typography>
                                    <FormControl fullWidth className={classes.margin}>
                                            <TextField disabled={true} helperText="Email一但註冊就無法修改" value={props.userEmail} id="email" label="Email" variant="outlined" />
                                        </FormControl>
                                        <FormControl fullWidth className={classes.margin}>
                                            <TextField disabled={handleCode==="loading"} error={ nameErr!==false } helperText={ nameErr!==false && (nameErr) } value={name} onChange={(e)=>setName(e.target.value)} id="name" label="暱稱" variant="outlined" />
                                        </FormControl>
                                    <Typography variant="h5" component="h1"><LockIcon/>安全與密碼</Typography>
                                    { props.googleSing ? 
                                        <>
                                            <AssignmentIndRoundedIcon style={ { fontSize: "128px", } }/>
                                            <Typography variant="h6">您正使用第三方帳號登入</Typography>
                                            <Typography variant="subtitle1">若要變更密碼，請於第三方平台變更</Typography>
                                        </>
                                    :
                                        <>
                                            <FormControl fullWidth className={classes.margin}>
                                            <TextField disabled={handleCode==="loading"} error={newPwErr!==false} helperText={ newPwErr!==false ? newPwErr : "如果不要變更密碼，此欄留空"} type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} id="pw" label="新密碼" variant="outlined" />
                                            </FormControl>
                                            <FormControl fullWidth className={classes.margin}>
                                                <TextField required disabled={handleCode==="loading"} error={oldPwErr!==false} helperText={oldPwErr!==false && (oldPwErr)} type="password" value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)} id="old-pw" label="確認舊密碼" variant="outlined" />
                                            </FormControl>
                                        </>
                                    }
                                    <CardContent>
                                        <CardActions disableSpacing className={ classes.flexRight }>
                                            <Button
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            className={ classes.flexRight }
                                            startIcon={ handleCode==='loading'? <CircularProgress size={24} className={classes.buttonProgress} /> : <SaveIcon />}
                                            onClick={handleUpdateAccount}
                                            disabled={handleCode==="loading"}>
                                            儲存設定
                                            </Button>
                                        </CardActions>
                                    </CardContent>
                                    </CardContent>
                                </Grid>
                            </Grid>
                        </TabPanel>             
                        <TabPanel value={tabValue} index={1}>
                            <CardContent>
                            <Typography variant="h5" component="h1">訂閱管理</Typography>
                                { subscribeList !== "" ? 
                                    <>
                                        <List>
                                            {  subscribeList }
                        
                                        </List>
                                    </>
                                    :
                                    <Typography variant="h4" component="h1"><br/>╮(╯▽╰)╭<br/>目前沒有任何訂閱！<br/>快去訂閱喜歡的頻道吧！</Typography>
                                    }
                            </CardContent>
                        </TabPanel>
                    </SwipeableViews>
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
                <Snackbar open={handleCode==="suc"} autoHideDuration={3000} onClose={props.dataupdate} message="您的變更已經儲存"/>
                <Dialog
                    open={updatePassword}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="logout-dialog-title">{"重新登入"}</DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        您的密碼已經更新<br/>請重新登入。
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleLogout} color="primary" autoFocus>
                        好！
                    </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        );
    }
}
export default Account;
//react
import React, { useState, useEffect, useRef } from 'react'
//ui
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { deepOrange } from '@material-ui/core/colors';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CircularProgress from '@material-ui/core/CircularProgress';
import AttachmentIcon from '@material-ui/icons/Attachment';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
//firebase
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


const FansAdmin = (props) => {
    const classes = useStyles();
    const [fansList, setFansList] = useState();
    const [showDelMsg, setShowDelMsg] = useState(false);
    const willDelFansId = useRef("");
    const isFirstLoad = useRef(true);


    useEffect(
        ()=>{
            if (isFirstLoad.current) {
                getFansList();
             }
             isFirstLoad.current = false;
        }
    )

    const genListItem = async(data)=>{
        var changeArr = Array();
        for (var value of Object.entries(data)) {
            await firebase.firestore().collection("user").doc(value[0]).get()
            .then((doc)=>{
                changeArr.push(
                    <ListItem key={value[0]}>
                    <ListItemAvatar>
                    <Avatar alt={doc.data().name} src={doc.data().avatar}/>
                    </ListItemAvatar>
                    <ListItemText
                        primary={doc.data().name}
                    />
                    <ListItemSecondaryAction>
                    <Button 
                        variant="outlined"
                        color="secondary"
                        value={value[0]}
                        onClick={(e)=>{showDelFansMsgBox(e)}}
                        className={classes.button}
                    >移除</Button>
                    </ListItemSecondaryAction>
                </ListItem>
                )
            });
        }
        return changeArr; 
    }

    const getFansList = async()=>{
        if (props.user.userId !== "") {
            firebase.firestore().collection("fans").doc(props.user.userId).get()
            .then((doc)=>{
                if (doc.data()===undefined){
                    setFansList("");
                } else if(Object.entries(doc.data()).length===0){
                    setFansList("");
                } else {
                    genListItem(doc.data()).then((arr)=>setFansList(arr))
                }                
            });
        } else {
            setFansList("");
        }
    }

    const showDelFansMsgBox = (e) =>{
        setShowDelMsg(true);
        willDelFansId.current = e.currentTarget.value;
    }

    const handelDelFans = (e)=>{
        setShowDelMsg(false);
        firebase.firestore().collection("subscribe").doc(willDelFansId.current).update(
            {[props.user.userId] : firebase.firestore.FieldValue.delete()}
        ).then(
            firebase.firestore().collection("fans").doc(props.user.userId).update(
                {[willDelFansId.current] : firebase.firestore.FieldValue.delete()}
            ).then(
                ()=>{getFansList();}
            )  
        )
    }

    if (fansList===undefined){
        return(<CircularProgress style={{marginTop: "25%"}} />);
    } else {
        return(
            <>
                <Container maxWidth="sm">
                    <Card className={classes.root}>
                        <CardContent>
                            <Typography variant="h5" component="h1">追蹤管理</Typography>
                            <Typography variant="body1" component="span">移除已經被允許追蹤的人</Typography>
                            <List dense>
                                {fansList}
                            </List>

                            <Dialog
                                open={showDelMsg}
                                onClose={()=>{setShowDelMsg(false)}}
                            >
                                <DialogTitle>移除追蹤</DialogTitle>
                                <DialogContent>
                                <DialogContentText>
                                    確定要移除追蹤？<br/>移除後對方必須重新追蹤才能再收聽您的頻道。
                                </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                <Button onClick={()=>{setShowDelMsg(false)}} color="primary" autoFocus>
                                    取消
                                </Button>
                                <Button onClick={handelDelFans} color="primary">
                                    確定
                                </Button>
                                </DialogActions>
                            </Dialog>
                        </CardContent>
                    </Card>
                </Container>
            </>
        )
    }
}
export default FansAdmin;
//react
import React, { useState, useEffect, useRef } from 'react';
import { Link as RLink } from 'react-router-dom';
//ui
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import DeleteIcon from '@material-ui/icons/Delete';
//firebase
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
//other
import { Helmet } from 'react-helmet';
import NotCreatePodcast from '../Podcast/NotCreatePodcast';
import { Grid } from '@material-ui/core';


const useStyles = makeStyles((theme)=>({
    root: {
        minWidth: 275,
        marginTop: 100,
        borderRadius: "10px",
    },
    appBar: {
      top: 'auto',
      bottom: 0,
      alignItems:"center"
    },
    pink:{
        color: "#FFFFFF",
        backgroundColor: "#FD3E49",
    }
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
                window.scrollTo(0, 0);
                isFirstLoad.current = false;
             }
        }
    )

    const genListItem = async(data)=>{
        var changeArr = Array();
        for (var value of Object.entries(data)) {
            await firebase.firestore().collection("user").doc(value[0]).get()
            .then((doc)=>{
                const data = doc.data();
                changeArr.push(
                <>
                    <ListItem key={value[0]}>
                    <ListItemAvatar>
                    <Avatar alt={data.name} src={data.avatar==="" ? "." : data.avatar} className={classes.pink}/>
                    </ListItemAvatar>
                    <ListItemText
                        primary={data.name}
                    />
                    <ListItemSecondaryAction>
                    <Button 
                        variant="contained"
                        color="primary"
                        value={value[0]}
                        onClick={(e)=>{showDelFansMsgBox(e)}}
                        className={classes.button}
                        startIcon={<DeleteIcon />}
                    >移除</Button>
                    </ListItemSecondaryAction>
                    </ListItem>
                    <br/>
                    <Divider />
                    <br/>
                </>
                )
            });
        }
        return changeArr; 
    }

    const getFansList = async()=>{
        if (props.user.userId.length > 0) {
            firebase.firestore().collection("fans").doc(props.user.userId).get()
            .then((doc)=>{
                const data = doc.data();
                if (data===undefined){
                    setFansList("");
                } else if(Object.entries(data).length===0){
                    setFansList("");
                } else {
                    genListItem(data).then((arr)=>setFansList(arr));
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
    } else if (props.user.userId.length <= 0) {
        return(
            <Container maxWidth="lg">
                <NotCreatePodcast/>
            </Container>)
    } else {
        return(
            <>
                <Helmet>
                    <title>追蹤管理 - Onlymycast</title>
                </Helmet>
                <Container maxWidth="lg" className={classes.root}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                            <Typography variant="h4">追蹤管理</Typography>
                            <Typography variant="body1" component="span">移除已經被允許追蹤的人</Typography>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <List dense>
                                {fansList}
                            </List>
                        </Grid>
                    </Grid>
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
                </Container>
            </>
        )
    }
}
export default FansAdmin;
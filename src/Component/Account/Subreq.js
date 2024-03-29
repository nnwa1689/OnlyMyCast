//react
import React, { useState, useEffect, useRef } from 'react'
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
import Button from '@material-ui/core/Button';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
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
    button: {
      margin: theme.spacing(0),
    },
    pink:{
        color: "#FFFFFF",
        backgroundColor: "#FD3E49",
    }
  }));

const Subreq = (props) => {
    const classes = useStyles();
    const [reqList, setReqList] = useState();
    const isFirstLoad = useRef(true);

    useEffect(
        ()=>{
            if (isFirstLoad.current) {
                getReqList();
                window.scrollTo(0, 0);
                isFirstLoad.current=false;
            }
        }
    )

    const handleSucReq= (e)=>{
        firebase.firestore().collection("subscribe").doc(e).set(
            {[props.user.userId] : firebase.firestore.FieldValue.serverTimestamp()},{ merge: true }
        ).then(
            firebase.firestore().collection("fans").doc(props.user.userId).set(
                {[e] : e},{ merge: true }
            ).then(()=>{
                firebase.database().ref('/subreq/' + e + "/" + props.user.userId).remove().then(()=>{
                    firebase.database().ref('/subcheck/' + props.user.userId + "/" + e).remove().then(()=>{
                        getReqList();
                    })
                }).catch()
            }
            )  
        );
    }

    const handleRejReq= (e)=>{
        firebase.database().ref('/subreq/' + e + "/" + props.user.userId).remove().then(()=>{
            firebase.database().ref('/subcheck/' + props.user.userId + "/" + e).remove().then(()=>{
                getReqList();
            })
        }).catch()
    }

    const genListItem = async(data)=>{
        var changeArr = Array();
        for (var i of Object.entries(data)){
            await firebase.firestore().collection("user").doc(i[0]).get()
            .then((doc)=>{
                const data = doc.data();
                changeArr.push(
                    <>
                        <ListItem key={i[0]}>
                        <ListItemAvatar>
                        <Avatar alt={data.name} src={data.avatar==="" ? "." : data.avatar} className={classes.pink}/>
                        </ListItemAvatar>
                        <ListItemText
                            primary={data.name}
                        />
                        <ListItemSecondaryAction>
                        <IconButton 
                        className={classes.button} 
                        variant="contained" 
                        value={i[0]}
                        onClick={(e)=>{handleSucReq(e.currentTarget.value)}}
                        color="primary" >
                            <CheckCircleIcon />
                        </IconButton>
                        <IconButton
                            variant="contained"
                            value={i[0]}
                            onClick={(e)=>{handleRejReq(e.currentTarget.value)}}
                            className={classes.button}>
                                <DeleteIcon />
                        </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <br/>
                    <Divider />
                    <br/>
                </>
                )
            })
        }
        return changeArr;
    }

    const getReqList = async()=>{
        firebase.database().ref('/subcheck/' + props.user.userId).once("value", e => {
          }).then(async(e)=>{
              const data = e.val();
              if (data !== undefined && data !== null && props.user.userId.length > 0) {
                  genListItem(data).then((arr)=>{
                    setReqList(arr);
                  }
                );  
              } else {
                  setReqList("");
              }

          })
    }

    if (props.user.userId.length <= 0) {
        return(
            <Container maxWidth="lg" className={classes.root}>
                <Helmet>
                    <title>追蹤審核 - Onlymycast</title>
                </Helmet>
                <NotCreatePodcast/>
            </Container>
            )
            } else {
                if (reqList === undefined) {
                    return(<CircularProgress style={{marginTop: "25%"}} />);
                } else {
                    return(
                        <Container maxWidth="lg" className={classes.root}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={3}>
                                    <Typography variant="h3">追蹤審核</Typography>
                                    <Typography variant="body1" component="span">允許或拒絕節目追蹤要求</Typography>
                                </Grid>
                                <Grid item xs={12} md={9}>
                                    <List dense>
                                        {reqList === "" ? 
                                            <>
                                                <Typography variant="h2" component="h1" gutterBottom>
                                                    ╮(╯▽╰)╭ <br/>
                                                </Typography>
                                                <Typography variant="h5" component="span">
                                                    呼～喘口氣<br/>目前沒有任何訂閱要求<br/>喝杯茶再回來吧～
                                                </Typography>
                                            </>
                                        :
                                        reqList
                                        }
                                    </List>
                                </Grid>
                            </Grid>
                        </Container>
                    );
                }
        }
}
export default Subreq;
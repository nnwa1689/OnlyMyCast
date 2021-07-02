import React, { useState, useEffect, useRef } from 'react'
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
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import { deepOrange } from '@material-ui/core/colors';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { Link as RLink, useHistory } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import CircularProgress from '@material-ui/core/CircularProgress';
import PeopleIcon from '@material-ui/icons/People';

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/database"



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
  }));


const PodcastHome = (props) => {
    const history = useHistory();
    const classes = useStyles();
    const [name, setName] = useState("");
    const [avatar,setAvatar] = useState("");
    const [intro, setIntro] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [subStatu, setSubStatu] = useState(0);
    //0:init 1:sub 2:unsub 3:req
    const isFirstLoad = useRef(true);
    const [subCount, setSubCount] = useState(0);


    useEffect(
        ()=>{
            //get 此頻道資料  是否被目前使用者訂閱
            if (isFirstLoad.current) {
                getChannleData();
                getSubStatu();
                isFirstLoad.current = false;
                countSub();
                setLoaded(true);
            }
        }
    )

    const countSub = ()=>{
        firebase.firestore().collection("fans").doc(props.match.params.id).get()
        .then((doc)=>{
            const data = doc.data();
            if (data===undefined){
                setSubCount(0);
            } else {
                setSubCount(Object.entries(data).length);
            }
        })
    }

    const getChannleData = ()=>{
        firebase.firestore().collection("channel").doc(props.match.params.id).get()
        .then(
          (doc)=>{
              if (doc.exists){
                setName(doc.data().name);
                setIntro(doc.data().intro);
                setAvatar(doc.data().icon);
              } else {

              }

          }
        );
    }

    const getSubStatu = ()=>{
        //已經訂閱
        firebase.firestore().collection("subscribe").doc(props.userUid).get()
        .then((doc)=>{ 
            const data = (doc.data()===undefined ? "" : doc.data());
            const found = Object.entries(data).find(
                ([key, value]) => key === props.match.params.id && value === props.match.params.id);
            if (found !== undefined){
                setSubStatu(1);
            } else {
                firebase.database().ref('/subreq/' + props.userUid + "/" + props.match.params.id).once("value", e => {
                //
                }).then((e)=>{
                        if (e.val()!== null){
                            setSubStatu(3)
                        } else {
                            setSubStatu(2);
                        }
                    }
                );
            }
        });
    }

    const handlePlayEvent = (e)=>{
        console.log(e.currentTarget.value);

    }

    const handleUnsub = (e) => {
        firebase.firestore().collection("subscribe").doc(props.userUid).update(
            {[props.match.params.id] : firebase.firestore.FieldValue.delete()}
        ).then(
            firebase.firestore().collection("fans").doc(props.match.params.id).update(
                {[props.userUid] : firebase.firestore.FieldValue.delete()}
            ).then(
                ()=>{setSubStatu(2);}
            )  
        )
    }

    const handleSub = (e) => {
        firebase.database().ref('/subreq/' + props.userUid).update(
            {
                [props.match.params.id] : props.match.params.id
            }
        ).then((e)=>{
            firebase.database().ref('/subcheck/' + props.match.params.id).update(
                {
                    [props.userUid] : props.userUid
                }
            ).then((e)=>{
                setSubStatu(3);
            })
        }).catch();
    }

    const handleRemoveReq = (e) => {
        firebase.database().ref('/subreq/' + props.userUid + "/" + props.match.params.id).remove().then((e)=>{
            firebase.database().ref('/subcheck/' + props.match.params.id + "/" + props.userUid).remove().then((e)=>{
                setSubStatu(2);
            })
        }).catch();
    }

    if (!loaded || name==="" || avatar==="" || subStatu===0) {
        return(<CircularProgress style={{marginTop: "25%"}} />);
    } else {
        return(
            <Container maxWidth="sm">
                <Card className={classes.root}>
                    <CardContent>
                    <Avatar variant="rounded" alt={name} src={avatar} className={classes.large} />
                    <Typography variant="h5" component="h1">{name}</Typography>
                    <br/>
                    <Divider />
                    <br/>
                    <Typography variant="body1" component="span">{intro}</Typography>
                    <br/><br/>
                    <Typography variant="body2" component="span"><PeopleIcon /><br/>{subCount} 位聽眾</Typography>
                    <br/><br/>
                    { props.user.userId === props.match.params.id ?
                        <Button variant="outlined" size="large" component={RLink} to="/podcastaccount">編輯電台資訊</Button>
                    :
                        <>
                        { subStatu===1 && 
                            <Button onClick={(e)=>handleUnsub(e)} variant="outlined" color="secondary" size="large" startIcon={<StarBorderIcon />}>
                                取消追蹤
                            </Button>
                        }

                        { subStatu===2 &&
                            <Button onClick={(e)=>handleSub(e)} variant="outlined" color="primary" size="large" startIcon={<StarIcon />}>
                                要求追蹤
                            </Button>   
                        }

                        {
                            subStatu===3 &&
                            <Button variant="outlined" size="large" onClick={(e)=>handleRemoveReq(e)}>已送出請求</Button>
                        }
                        </>
                    }
                    
    
                    <br/>
                    <br/>
                    <Divider/>

                    { subStatu===1 || props.user.userId === props.match.params.id ?   
                        <>
                        {/*獨立出去 PodcastespListItem*/}
                            <ListItem component="span">
                                <ListItemIcon>
                                    <IconButton 
                                    aria-label="play"
                                    value="hashPod"
                                    data-uri="https://firebasestorage.googleapis.com/v0/b/noteshazuya.appspot.com/o/%E5%85%89%E8%89%AF%20Michael%20Wong%E6%9B%B9%E6%A0%BC%20Gary%20Chaw%E3%80%90%E5%B0%91%E5%B9%B4%E3%80%91Official%20Music%20Video.mp3?alt=media&token=44b2b151-45c2-4997-aa5a-9b01c95b5d49"
                                    data-coveruri="https://img.mymusic.net.tw/mms/album/L/036/36.jpg"
                                    data-titlename="少年"
                                    data-podcastname="幹話"
                                    onClick={props.setPlayer}>
                                        <PlayArrowIcon/>
                                    </IconButton>
                                </ListItemIcon>
                                <ListItemText>
                                    <Link component={RLink} to={"/podcastdetail/" + "flkj"} variant="h6">哈囉白痴</Link><br/>
                                    <Typography variant="body1" component="span">這是白癡電台的第一個廣播，請多多指教哦哦哦！！！！</Typography>
                                </ListItemText>
                            </ListItem>
                            <Divider/>
                            {/*獨立出去 PodcastespListItem*/}
                        </>
                    :
                        <Typography variant="h3" component="h1"><br/>(＞^ω^＜)<br/><br/>訂閱後即可收聽</Typography>
                    }
    
                    </CardContent>
                </Card>
            </Container>
        );
    }
    

}
export default PodcastHome;
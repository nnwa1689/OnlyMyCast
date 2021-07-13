//react
import React, { useState, useEffect, useRef } from 'react'
import { Link as RLink } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'
//ui
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { deepOrange } from '@material-ui/core/colors';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import CircularProgress from '@material-ui/core/CircularProgress';
import PeopleIcon from '@material-ui/icons/People';
import PodcastspList from './PodcastspList';
import List from '@material-ui/core/List';
//firebase
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
    const classes = useStyles();
    const [name, setName] = useState("");
    const [avatar,setAvatar] = useState("");
    const [intro, setIntro] = useState("");
    const [subStatu, setSubStatu] = useState(0);
    //0:init 1:sub 2:unsub 3:req
    const isFirstLoad = useRef(true);
    const [subCount, setSubCount] = useState(0);
    const [spList, setSpList] = useState();

    useEffect(
        ()=>{
            //get 此頻道資料  是否被目前使用者訂閱
            if (isFirstLoad.current && props.user!=="" && props.userUid!=="") {
                getChannleData();
                getSubStatu();
                countSub();
            } else if (props.user==="" || props.userUid === "") {
                getChannleData();
                setSpList("");
                setSubStatu(4);
            }
            isFirstLoad.current = false;
        }
    )

    useEffect(
        ()=>{
            if (subStatu===1 || props.user.userId === props.match.params.id) {
                getPodcastList();
            } else {
                setSpList(false);
            }
        }, [subStatu]
    )

    const getPodcastList = async()=>{
        var changeArr = Array();
        await firebase.firestore().collection("podcast").doc(props.match.params.id).collection('podcast').orderBy('updateTime', "desc").get()
        .then((e)=>{
            if (e.docs.length ===0) {
                changeArr = "";
            } else {
                for (var doc of e.docs) {
                    changeArr.push(
                        <PodcastspList
                            key={doc.id}
                            podId={doc.id}
                            podTitle={doc.data().title}
                            channelName={name}
                            audioUrl={doc.data().url}
                            podIcon={avatar}
                            podIntro={doc.data().intro}
                            setPlayer={props.setPlayer}
                            userId={props.match.params.id}
                            updateTime={doc.data().updateTime}
                            duration={doc.data().duration}
                        />
                    )
                }  
            }
        }).then(()=>{setSpList(changeArr)})
    }

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

    const updateClickDate = ()=>{
        firebase.firestore().collection("subscribe").doc(props.userUid).set(
            {[props.match.params.id] : firebase.firestore.FieldValue.serverTimestamp()},{ merge: true }
        )
    }

    const getSubStatu = ()=>{
        //已經訂閱
        firebase.firestore().collection("subscribe").doc(props.userUid).get()
        .then((doc)=>{ 
            const data = (doc.data()===undefined ? "" : doc.data());
            const found = Object.entries(data).find(
                ([key, value]) => key === props.match.params.id );
            if (found !== undefined){
                setSubStatu(1);
                updateClickDate();
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

    if ( name==="" || avatar==="" || subStatu===0 || spList===undefined) {
        return(<CircularProgress style={{marginTop: "25%"}} />);
    } else {
        return(
            <Container maxWidth="sm">
                <Card className={classes.root}>
                    <CardContent>
                    <Avatar variant="rounded" alt={name} src={avatar} className={classes.large} />
                    <Typography variant="h5" component="h1">{name}</Typography>
                    { subStatu !== 4 && (<Typography variant="body2" component="span"><br/><PeopleIcon /><br/>{subCount} 位聽眾<br/><br/></Typography>) }
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
                    <br/><br/>
                    <Divider />
                    <Typography style={{textAlign:"left"}} variant="body1" component="span">
                        <ReactMarkdown>{intro}</ReactMarkdown>
                    </Typography>
                    <br/>
                    <Divider/>

                    { subStatu===1 || props.user.userId === props.match.params.id ?   
                        
                            spList === "" ? 
                            <Typography variant="h4" component="span"><br/>¯\_(ツ)_/¯<br/>還沒有任何節目<br/>稍後再回來吧</Typography>
                            :
                            <List>
                                {spList}
                            </List>
                    :
                        <Typography variant="h4" component="span"><br/>(＞^ω^＜)<br/><br/>訂閱後即可收聽</Typography>
                    }
                    </CardContent>
                </Card>
            </Container>
        );
    }
}
export default PodcastHome;
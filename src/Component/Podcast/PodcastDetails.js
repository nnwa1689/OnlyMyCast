//react
import React, { useState, useEffect, useRef } from 'react'
import { Link as RLink, Redirect } from 'react-router-dom';
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
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import Link from '@material-ui/core/Link';
import CircularProgress from '@material-ui/core/CircularProgress';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import EventIcon from '@material-ui/icons/Event';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import Grid from '@material-ui/core/Grid';
//firebase
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/database";
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
    large: {
      width: theme.spacing(20),
      height: theme.spacing(20),
      marginBottom: theme.spacing(3),
      marginTop:theme.spacing(3),
      color: "#FFFFFF",
      backgroundColor: "#FD3E49",
      marginLeft:"auto",
      marginRight:"auto"
    },
  }));


const PodcastDetails = (props) => {
    const classes = useStyles();
    const [name, setName] = useState();
    const [avatar,setAvatar] = useState();
    const [intro, setIntro] = useState();
    const [updateTime, setUpdateTime] = useState();
    const [channelName, setChannelName] = useState();
    const [audioUrl, setAudioUrl] = useState();
    const [duration, setDuration] =  useState("");
    const [subStatu, setSubStatu] = useState();
    const [played, setPlayed] = useState(false);
    const [publicStatu, setPublicStatu] = useState();

    const isFirstLoad = useRef(true);

    useEffect(
      ()=>{
        if (isFirstLoad.current) {
          getSPData();
          getChannelData();
          //沒有登入就不取得訂閱狀態與播放狀態，將播放狀態設定為永遠未播放，訂閱狀態在 getChannelData 設定
          if (props.isAuth) {
            getPlayedStatu();
            getSubStatu();
          } else {
            setPlayed(false);
            setSubStatu(0);
          }
          window.scrollTo(0, 0);
          isFirstLoad.current = false;
        }
      }
    )

    const getPlayedStatu = () => {
      firebase.firestore()
      .collection("podcast")
      .doc(props.match.params.id)
      .collection('podcast')
      .doc(props.match.params.podId)
      .collection('playedlist')
      .doc(props.userUid)
      .get()
      .then(
        (e) => {
          if (e.exists) {
            setPlayed(true);
          }
        }
      )
    }

    const getSubStatu = ()=>{
      //已經訂閱
      firebase.firestore().collection("subscribe").doc(props.userUid).get()
      .then((doc)=>{ 
          const data = (doc.data()===undefined ? "" : doc.data());
          const found = Object.entries(data).find(
              ([key, value]) => key === props.match.params.id);
          if (found !== undefined){
              setSubStatu(1);
          } else {
            setSubStatu(0);
          }
      });
  }

    const toDataTime = (sec)=>{
      var t = new Date(Date.UTC(1970, 0, 1, 0, 0, 0))
      t.setUTCSeconds(sec);
      return t.toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'},);
    }

    const getChannelData = ()=>{
      firebase.firestore().collection("channel").doc(props.match.params.id).get()
        .then((doc)=>{
          const data = doc.data();
          if (data===undefined) {

          } else if (Object.entries(data).length===0) {

          } else {
            setChannelName(data.name)
            setAvatar(data.icon);
            
            // 檢查頻道公不公開
            if (data.publicStatu === 'true') {
              setPublicStatu(true);
            } else {
              setPublicStatu(false);
            }
        }
      })
    }

    const getSPData = ()=>{
      firebase.firestore().collection("podcast").doc(props.match.params.id).collection('podcast').doc(props.match.params.podId).get()
        .then((doc)=>{
          const data = doc.data();
          if (data===undefined) {

          } else if (Object.entries(data).length===0) {

          } else {
            setName(data.title);
            setIntro(data.intro);
            setUpdateTime(toDataTime(data.updateTime.seconds));
            setAudioUrl(data.url)
            setDuration(data.duration)
          }
        })
    }
    
    if (name===undefined || audioUrl===undefined || intro===undefined || updateTime===undefined || publicStatu === undefined || subStatu === undefined || channelName===undefined ) {
      return(<CircularProgress style={{marginTop: "25%"}} />);
    } else {
      return(
        <Container maxWidth="md">
          { subStatu===1 || publicStatu || props.user.userId === props.match.params.id ?
              <Card className={classes.root}>
                <Helmet>
                    <title>{ name } - { channelName } - Onlymycast</title>
                </Helmet>
                <CardContent>
                <Grid container justify="center" direction="row">
                  <Grid item xs={12} sm={4} md={3}>
                    <Avatar variant="rounded" alt={name} src={avatar} className={classes.large} />
                  </Grid>  
                  <Grid item xs={12} sm={7} md={8}>
                    <Typography style={ {paddingTop: "16px"} } variant="h5">{name}</Typography>
                    <Link component={RLink} to={"/podcast/" + props.match.params.id} variant="h5">{channelName}</Link>
                    <br/>
                    <Typography variant="body1" component="span">
                      <ListItemIcon><EventIcon/>{updateTime}</ListItemIcon><br/>
                      <ListItemIcon><AccessTimeIcon/>{duration}</ListItemIcon>
                      &nbsp;
                      { played ? <ListItemIcon><PlayCircleOutlineIcon/>已播放</ListItemIcon> : "" }
                      </Typography>
                    <br/>
                    <Button 
                        color="primary"
                        variant="contained"
                        size="large"
                        fullWidth 
                        startIcon={<PlayCircleFilledWhiteIcon/>}
                        value={props.match.params.podId}
                        data-uri={audioUrl}
                        data-coveruri={avatar}
                        data-titlename={name}
                        data-podcastname={channelName}
                        data-poduserid = { props.match.params.id }
                        onClick={props.setPlayer}>
                        播放單集
                    </Button>
                  </Grid>
                </Grid>
                <br/>
                <Divider/>
                <br/>
                <Typography style={{textAlign:"left"}} variant="body1" component="span"><ReactMarkdown>{intro}</ReactMarkdown></Typography>
                </CardContent>
              </Card>
          :
          ""
        }
        </Container>
      );
    }
}
export default PodcastDetails;
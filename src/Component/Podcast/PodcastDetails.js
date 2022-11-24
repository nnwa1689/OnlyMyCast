//react
import React, { useState, useEffect, useRef } from 'react'
import { Link as RLink } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'
//ui
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import InstagramIcon from '@material-ui/icons/Instagram';
import LinkIcon from '@material-ui/icons/Link';
import Link from '@material-ui/core/Link';
import CircularProgress from '@material-ui/core/CircularProgress';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import EventIcon from '@material-ui/icons/Event';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
//firebase
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/database";
//other
import { Helmet } from 'react-helmet';
import { Divider } from '@material-ui/core';
import * as htmlToImage from 'html-to-image';
//static
import Icon from '../../static/only-my-cast-icon-pink.svg';


const useStyles = makeStyles((theme)=>({
    root: {
        minWidth: 275,
        marginTop: 100,
        borderRadius: "10px",
        alignItems:"center",
        textAlign:"center"
    },
    large: {
      width: theme.spacing(24),
      height: theme.spacing(24),
      marginBottom: theme.spacing(1),
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
    const [showCopyMsg, setShowCopyMsg] = useState(false);

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

    const handleCopy = (text)=> {
      navigator.clipboard.writeText(text)
      .then(() => {
          setShowCopyMsg(true);
      }).catch(err => {
      console.log('Something went wrong', err);
      })
    }

    const handleDownloadShareImg = () => {


      document.getElementById('shareImg').style.display = "block";
      htmlToImage.toPng(document.getElementById('shareImg'))
      .then(function (dataUrl) {
        const link = document.createElement('a');
        link.download = "shareImg.png";
        link.href = dataUrl;
        link.click();

      })
      .catch(
        (e) => { 
          console.log('downloadError!');
         }
      );

    }

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
          if ( data !== undefined && Object.entries(data).length !== 0) {
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
          if ( data !== undefined && Object.entries(data).length !== 0) {
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
        <Container className={classes.root} maxWidth="lg">
          { subStatu===1 || publicStatu || props.user.userId === props.match.params.id ?
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                  <Helmet>
                      <title>{ name } - { channelName } - Onlymycast</title>
                  </Helmet>
                  <CardContent>
                    <Avatar variant="rounded" alt={name} src={avatar} className={classes.large} />
                    <Typography style={ {paddingTop: "16px"} } variant="h5">{name}</Typography>
                    <Link component={RLink} to={"/podcast/" + props.match.params.id} variant="h5">{channelName}</Link>
                    <br/>
                    <Typography variant="body1" component="p">
                      <ListItemIcon><EventIcon/>{updateTime}</ListItemIcon><br/>
                      <ListItemIcon><AccessTimeIcon/>{duration}</ListItemIcon>
                      &nbsp;
                      { played ? <ListItemIcon><PlayCircleOutlineIcon/>已播放</ListItemIcon> : "" }
                      </Typography>
                    <Tooltip title="複製分享連結">
                      <IconButton onClick={ () => {handleCopy("https://onlymycast.notes-hz.com/webapp/podcastdetail/" + props.match.params.id + '/' + props.match.params.podId)} } size='large'>
                        <LinkIcon fontSize='large' />
                      </IconButton>
                    </Tooltip>
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
                  </CardContent>
              </Grid>
              <Grid item xs={12} md={8}>
                <CardContent>
                  <h3 style={{textAlign:"left"}} variant="subtitle1" component="p">
                    單集介紹
                  </h3>
                  <Divider/><br/>
                  <Typography style={{textAlign:"left"}} variant="body1" component="span"><ReactMarkdown>{intro}</ReactMarkdown></Typography>
                </CardContent>
              </Grid>
              <Snackbar open={showCopyMsg===true} autoHideDuration={3000} onClose={()=>{setShowCopyMsg(false)}} message="已經複製到剪貼簿"/>
            </Grid>
            :
            ""
          }
        </Container>
      );
    }
}
export default PodcastDetails;
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
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import Link from '@material-ui/core/Link';
import CircularProgress from '@material-ui/core/CircularProgress';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
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


const PodcastDetails = (props) => {
    const classes = useStyles();
    const [name, setName] = useState();
    const [avatar,setAvatar] = useState();
    const [intro, setIntro] = useState();
    const [updateTime, setUpdateTime] = useState();
    const [channelName, setChannelName] = useState();
    const [audioUrl, setAudioUrl] = useState();

    const isFirstLoad = useRef(true);

    useEffect(
      ()=>{
        if (isFirstLoad.current) {
          getSPData();
          getChannelData();
          isFirstLoad.current = false;
        }
      }
    )

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
          }
        })
    }
    
    if (name===undefined || audioUrl===undefined || intro===undefined || updateTime===undefined || channelName===undefined) {
      return(<CircularProgress style={{marginTop: "25%"}} />);
    } else {
      return(
        <Container maxWidth="sm">
            <Card className={classes.root}>
                <CardContent>
                <Avatar variant="rounded" alt={name} src={avatar} className={classes.large} />
                <Typography variant="h5" component="h1">{name}</Typography>
                <Link component={RLink} to={"/podcast/" + props.match.params.id} variant="h6">{channelName}</Link>
                <br/>
                <Typography variant="body1" component="span"><AccessTimeIcon/>{updateTime}</Typography>
                <br/><br/>
                <Button 
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth 
                    startIcon={<PlayCircleFilledWhiteIcon/>}
                    value={props.match.params.podId}
                    data-uri={audioUrl}
                    data-coveruri={avatar}
                    data-titlename={channelName}
                    data-podcastname={name}
                    onClick={props.setPlayer}>
                    播放單集
                </Button>
                <br/><br/>
                <Divider/>
                <br/><br/>
                <Typography variant="body1" component="span"><ReactMarkdown>{intro}</ReactMarkdown></Typography>
                </CardContent>
            </Card>
        </Container>
      );
    }
}
export default PodcastDetails;
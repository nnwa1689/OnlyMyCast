import React, { useState, useEffect } from 'react'
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
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import Link from '@material-ui/core/Link';
import { Link as RLink, useHistory } from 'react-router-dom';

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

    useEffect(
      ()=>{
      }
    )

    

    const handlePlayEvent = (e)=>{
        console.log(e.currentTarget.value);

    }

    const handleUnsub = (e) => {

    }

    const handleSub = (e) => {

    }

    const handleRemoveReq = (e) => {

    }


    return(

        <Container maxWidth="sm">
            <Card className={classes.root}>
                <CardContent>
                
                <Avatar variant="rounded" alt="啊哈（白痴怪談）" src={avatar} className={classes.large} />
                <Typography variant="h5" component="h1">哈囉白痴，第一集的廢話啊哈</Typography>
                <Link component={RLink} to={"/podcast/sasf"} variant="h6">廢物日誌</Link>
                <br/>
                <Typography variant="body1" component="datetime">2020/12/20</Typography>
                <br/><br/>
                <Button 
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth 
                    startIcon={<PlayCircleFilledWhiteIcon />}
                    value="hashPod"
                    data-uri="https://firebasestorage.googleapis.com/v0/b/noteshazuya.appspot.com/o/%E5%85%89%E8%89%AF%20Michael%20Wong%E6%9B%B9%E6%A0%BC%20Gary%20Chaw%E3%80%90%E5%B0%91%E5%B9%B4%E3%80%91Official%20Music%20Video.mp3?alt=media&token=44b2b151-45c2-4997-aa5a-9b01c95b5d49"
                    data-coveruri="https://img.mymusic.net.tw/mms/album/L/036/36.jpg"
                    data-titlename="少年"
                    data-podcastname="幹話"
                    onClick={props.setPlayer}>
                    播放單集
                </Button>
                <br/><br/>
                <Divider/>
                <br/><br/>
                <Typography variant="body1" component="span">哈囉白痴</Typography>
                </CardContent>
            </Card>
        </Container>
    );

}
export default PodcastDetails;
//react
import React, { useState, useEffect, useRef } from 'react'
//ui
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Container } from '@material-ui/core';
import CastIcon from '@material-ui/icons/Cast';
import MyPodcastList from './MyPodcastList';
import PodcastList from './PodcastList';
import CircularProgress from '@material-ui/core/CircularProgress';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Grid from '@material-ui/core/Grid';
//firebase
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";


const useStyles = makeStyles((theme)=>({
    root: {
      marginTop: 30,
      borderRadius: "10px",
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
  })
  );

const Home = (props) => {

    const classes = useStyles();
    const [subscribeList, setSubscribeList] = useState();
    const [selfChannel, setSelfChannel] = useState();
    const isFirstLoad = useRef(true);
    
    useEffect(
      ()=>{
        if (isFirstLoad.current && props.user!=="") {
          getSubscribe();
          getSelfChannelData();
          window.scrollTo(0, 0);
          isFirstLoad.current=false;
        }
      }
    )

    const checkHaveEP = async(channelUpdateTime, userClickTime)=>{
      if (userClickTime===undefined) {
        return true;
      } else {
        return channelUpdateTime >= userClickTime;
      }
    }

    const getSubscribe = async()=>{
      var changeArr = Array();
      let tarData = Array();
      firebase.firestore().collection("subscribe").doc(props.userUid).get()
      .then(async(doc)=>{ 
          if (doc.exists) {
              if (Object.entries(doc.data()).length === 0) {
                  setSubscribeList("")
              } else {
                for (var value of Object.entries(doc.data())) {
                  await firebase.firestore().collection("channel").doc(value[0]).get()
                  .then((doc)=>{
                      tarData.push({"data":doc.data(), "date": value[1] });
                  })
                }
                for (var value of tarData.sort(function(a,b) {return b.data.updateTime.seconds - a.data.updateTime.seconds;})) {
                  const haveep = await checkHaveEP(value.data.updateTime.seconds, value.date.seconds);
                  changeArr.push(
                    <MyPodcastList 
                      key={value.data.userId} 
                      podcastName={value.data.name} 
                      podcastIntro={value.data.intro} 
                      podcastCover={value.data.icon} 
                      podcastId={value.data.userId}
                      haveNewEP={haveep}
                      updateTime={value.data.updateTime.seconds}
                      >
                  </MyPodcastList>
                  )
                }
                setSubscribeList(changeArr);
              }
          } else {
              setSubscribeList("");
          }
        }
    );
  }

  const getSelfChannelData = ()=>{
    if (props.user.userId!=="") {
      firebase.firestore().collection("channel").doc(props.user.userId).get()
      .then((doc)=>{
        setSelfChannel(doc.data());
      });
    } else {
      setSelfChannel("");
    }
  }
  
  if (subscribeList===undefined || selfChannel===undefined) {
    return(<CircularProgress style={{marginTop: "25%"}} />);
  } else {
    return (
      <Container maxWidth="md">
          <Card className={classes.root} style={{marginTop: 100}}>
            <CardContent>
            <Typography variant="h5" component="h1">
                  <CastIcon/>我的頻道
              </Typography>
              {
                props.user.userId ==="" ?
                <Typography variant="body1" component="span">
                  你目前沒有建立電台<br/>
                </Typography>
                :
                <PodcastList key={0} podcastName={selfChannel.name} podcastIntro={selfChannel.intro} podcastCover={selfChannel.icon} podcastId={props.user.userId}></PodcastList>
              }
            </CardContent>
          </Card>
          <Card className={classes.root}>
              <CardContent>
              <Typography variant="h5" component="h1">
                  <FavoriteIcon/>我的訂閱
              </Typography>
              </CardContent>
          </Card>
          <br/>
          <Grid container spacing={4}>
              {subscribeList ==="" ?
                <>
                  <Typography variant="h2" component="h1">
                      (^ｰ^)ノ<br/>
                  </Typography>
                  <Typography variant="h5" component="span">
                      嗨<br/>你還沒有訂閱任何電台<br/>快去尋找屬於你的電台吧！
                  </Typography>
                </>
               :
               subscribeList
               }
              </Grid>
      </Container>
    )
  }
    
}
export default Home;
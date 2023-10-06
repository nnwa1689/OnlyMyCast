//react
import React, { useState, useEffect, useRef } from 'react'
//ui
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import BarChartIcon from '@material-ui/icons/BarChart';
import Divider from '@material-ui/core/Divider';
import PeopleIcon from '@material-ui/icons/People';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
//firebase
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/database"
//other
import { Helmet } from 'react-helmet';

const useStyles = makeStyles((theme)=>({
    root: {
        minWidth: 275,
        marginTop: 100,
        borderRadius: "10px",
        alignItems:"center",
        textAlign:"center",
        justifyContent: 'center',
        '& > *': {
            margin: theme.spacing(1),
          },
    },
      margin: {
        marginBottom: theme.spacing(2),
        marginTop:theme.spacing(2)
      },
      pink:{
        color: "#FFFFFF",
        backgroundColor: "#FD3E49",
    },
  })
  );

  const AnalyticsPodcastDetails = (props) => {

    const classes = useStyles();
    const [playedList, setPlayedList] = useState();
    const [playedTimes, setPlayedTimes] = useState();
    const isFirstLoad = useRef(true);

    useEffect(
        ()=>{
            if (isFirstLoad.current) {
                getPlayedData();
                window.scrollTo(0, 0);
                isFirstLoad.current = false;
            }
        }
    )

    const getPlayedData = async()=>{
        var chanArr = new Array();
        await firebase.firestore().collection("podcast")
        .doc(props.user.userId)
        .collection('podcast')
        .doc(props.match.params.podId)
        .collection('playedlist')
        .get()
          .then(async(qs)=>{
            if (qs.size > 0) {
                for (var q of qs.docs) {
                    const data = q.data();
                    if (data===undefined) {
                        //
                    } else {
                        chanArr.push(
                            <>
                            <ListItem key={data.name}>
                            <ListItemAvatar>
                            <Avatar alt={data.name} src={data.avatar==="" ? "." : data.avatar} className={classes.pink}/>
                            </ListItemAvatar>
                            <ListItemText
                                primary={data.name}
                            />
                            <ListItemSecondaryAction>
                            </ListItemSecondaryAction>
                            </ListItem>
                            <br/>
                            <Divider />
                            <br/>
                            </>

                        )
                    }
                }
            }
            setPlayedList(chanArr);
            setPlayedTimes(qs.size);
          })
      }

    if (playedList === undefined) {
        return(<CircularProgress style={{marginTop: "25%"}} />);
    } else {
        return(
            <Container maxWidth="lg" className={classes.root}>
            <Helmet>
                <title>單集分析 - Onlymycast</title>
            </Helmet>
                
                <Typography variant="h5" component="h1">單集點閱分析</Typography><br/>
                <Typography variant="h6" component="span"><BarChartIcon />&nbsp;總播放人次：{ playedTimes }</Typography>
                <br/><br/>
                <Divider /><br/>
                <Typography variant="h6" component="span"><PeopleIcon />&nbsp;誰播放過</Typography><br/>
                <List dense>
                    { playedList }
                </List>
                
            </Container>
        );    
    }
}
export default AnalyticsPodcastDetails;
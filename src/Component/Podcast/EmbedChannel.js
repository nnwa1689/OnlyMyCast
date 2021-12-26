import React, { useState, useEffect, useRef } from 'react';
//UI
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Avatar from '@material-ui/core/Avatar';
//firebase
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
//static
import Icon from '../../static/only-my-cast-icon-pink.svg';


const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      margin: 0,
      padding: '20px',
    },
    details: {
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      flex: '1 0 auto',
      paddingTop: 0,
      paddingBottom: 10,
      maxHeight: 75,
      minHeight: 75,
      overflow: "hidden",
      textAlign: "left",
    },
    controls: {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    slogan:{
        alignContent: "center",
        alignItems: "left",
        textAlign: "left",
        marginLeft:20,
        marginTop:10,
    },
    large: {
        width: 130,
        height: 130,
        color: "#FFFFFF",
        backgroundColor: "#FD3E49",
    },
  }));
  

const EmbedChannel = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const isFirstLoad = useRef(true);
    const [name, setName] = useState();
    const [avatar, setAvatar] = useState();
    const [intro, setIntro] = useState();

    const getChannleData = ()=>{
        firebase.firestore().collection("channel").doc(props.match.params.id).get()
        .then(
          (doc)=>{
              if (doc.exists){
                setName(doc.data().name.length > 10 ? doc.data().name.substring(0, 9) + "⋯" : doc.data().name);
                setIntro( doc.data().intro.length > 60 ?  doc.data().intro.substring(0, 59) + "⋯" : doc.data().intro );
                setAvatar(doc.data().icon);
              }
          }
        );
    }

    useEffect(
        () => {
            document.body.style.backgroundColor = "#FFFFFF"
            if (isFirstLoad.current) {
                getChannleData();
                isFirstLoad.current = false;
            }
        }
    )

    return (
        <Card style={{ background: "#f7f7f7", maxHeight: 200, borderRadius: 20, boxShadow: "none", maxHeight: "200px" }}>
            <div className={classes.slogan}>
                <Typography style={{ lineHeight: "10px" }} variant="body2" component="span" color="textSecondary">
                    <img alt="OnlyMyCast" src={Icon} height="18" />&nbsp;OnlyMyCast - 建立自己私人的Podcast
                </Typography>
            </div>

            <div className={classes.root}>
                <CardMedia>
                    <Avatar variant="rounded" src={avatar} className={classes.large} />
                </CardMedia>
                <div className={classes.details}>
                    <CardContent className={classes.content}>
                    <Typography component="span" variant="h6">
                        { name }
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        { intro }
                    </Typography>
                    </CardContent>
                    <div className={classes.controls}>
                        <Button
                            href={"https://onlymycast.notes-hz.com/webapp/podcast/" + props.match.params.id}
                            target="_blank"
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<ArrowForwardIosIcon/>}>
                            前往追蹤收聽
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
export default EmbedChannel;
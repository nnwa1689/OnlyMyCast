//react
import React, { useState, useEffect } from 'react'
import { Link as RLink } from 'react-router-dom';
//ui
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import Badge from '@material-ui/core/Badge';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import { Divider } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import EventIcon from '@material-ui/icons/Event';
import ListItemIcon from '@material-ui/core/ListItemIcon';

const useStyles = makeStyles((theme)=>({
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    large: {
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(20),
        height: theme.spacing(20),
      },
      width: "100%",
      height: "80%",
      borderRadius: 25,
      color: "#FFFFFF",
      backgroundColor: "#FD3E49",
      },
    media: {
        borderRadius: 6,
      },
    card: {
      borderRadius: 20,
      textAlign: 'center',
    },
    header: {
      textAlign: 'center',
      spacing: 10,
    },
    action: {
      display: 'flex',
      justifyContent: 'space-around',
    }
  })
  );


  const PodcastList = (props) => {

    const classes = useStyles();
    const [haveNewEP, setHaveNewEP] = useState(false);
    //const [intro, setIntro] = useState(props.podcastIntro.length>=30 ? props.podcastIntro.substring(0, 30) + "⋯" : props.podcastIntro);
    const [podcastName, setPodcastName] = useState(props.podcastName.length>=15 ? props.podcastName.substring(0, 15) + "..." : props.podcastName);
    
    const toDataTime = (sec)=>{
      var t = new Date(Date.UTC(1970, 0, 1, 0, 0, 0))
      t.setUTCSeconds(sec);
      return t.getFullYear() + '/' + (t.getMonth()+ 1) + '/' + t.getDate()
      //return t.toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'},);
    }

    useEffect(
      ()=>{
        if (props.haveNewEP!==false && props.haveNewEP!==undefined) {
          setHaveNewEP(true);
        }
      }
    )
    return (
    <Grid item xs={12} sm={4} md={3} lg={2}>
      <Badge
          color={haveNewEP ? "primary" : ""}
          badgeContent={haveNewEP && "新單集"}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}>
        <div className={classes.card}>
          <Avatar component={RLink} to={"/podcast/" + props.podcastId} variant="rounded" className={classes.large} alt={props.podcastName} src={props.podcastCover} />
          <br/>
          <Link component={RLink} to={"/podcast/" + props.podcastId} variant="subtitle1" underline="hover">{podcastName}</Link>
          <Divider variant="middle" />
          <CardActions className={classes.action}>
          <Typography align="left" variant="subtitle2"><ListItemIcon><EventIcon fontSize='small'/>{ toDataTime(props.updateTime) }</ListItemIcon></Typography>
          </CardActions>
        </div>
      </Badge>
    </Grid>
    )
}
export default PodcastList;
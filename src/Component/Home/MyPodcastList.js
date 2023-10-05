//react
import React, { useState, useEffect } from 'react'
import { Link as RLink } from 'react-router-dom';
//ui
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import GraphicEqIcon from '@material-ui/icons/GraphicEq';
import PublishIcon from '@material-ui/icons/Publish';
import FaceIcon from '@material-ui/icons/Face';

const useStyles = makeStyles((theme)=>({
    root: {
      minWidth: 275,
      marginTop: 100,
      marginBottom: 0,
    },
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
        width: theme.spacing(8),
        height: theme.spacing(8),
        marginRight: theme.spacing(2),
        color: "#FFFFFF",
        backgroundColor: "#FD3E49",
      },
  })
  );


  const MyPodcastList = (props) => {
    const classes = useStyles();  
    const [haveNewEP, setHaveNewEP] = useState(false);
    const [intro, setIntro] = useState(props.podcastIntro.length>=80 ? props.podcastIntro.substring(0, 80) + "⋯" : props.podcastIntro);
    const [podcastName, setPodcastName] = useState(props.podcastName.length>=20 ? props.podcastName.substring(0, 20) + "...." : props.podcastName);
    useEffect(
      ()=>{
        if (props.haveNewEP!==false && props.haveNewEP!==undefined) {
          setHaveNewEP(true);
        }
      }
    )
    return (
        <>
          <Grid item xs={12} sm={9}>
            <ListItem component={RLink} to={"/podcast/" + props.podcastId} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar variant="rounded" className={classes.large} alt={props.podcastName} src={props.podcastCover} />
                  </ListItemAvatar>
                  <ListItemText
                  secondary={
                      <React.Fragment>
                      <Link variant="body1" underline="none">{podcastName}</Link> 
                      <br/>
                      <Typography
                          component="span"
                          variant="subtitle1"
                          color="textPrimary">
                      {intro}
                      </Typography>
                      </React.Fragment>
                  }
                  />
            </ListItem>
          </Grid>
          <Grid item xs={12} sm={3} justify='flex-end'>
            <Tooltip title="編輯頻道">
              <IconButton aria-label="editChannel" component={RLink} to={"/podcastaccount"} color="primary">
                <GraphicEqIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="單集管理">
              <IconButton aria-label="editPodcast" component={RLink} to={"/editpodcasts"} color="primary">
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="上傳單集">
              <IconButton aria-label="newPodcast" component={RLink} to={"/uploadpodcast"} color="primary">
                <PublishIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="追蹤管理">
              <IconButton aria-label="fansAdmin" component={RLink} to={"/fansadmin"} color="primary">
                <FaceIcon />
              </IconButton>
            </Tooltip>
            <br/>
            <Typography align='center' variant="subtitle2"><FaceIcon fontSize="small"/>{ props.podcastFansCount } 位粉絲</Typography>
            <Typography align='center' variant="subtitle2"><GraphicEqIcon fontSize="small" />{ props.spCount } 集節目</Typography>
          </Grid>
        </>
    )
}
export default MyPodcastList;
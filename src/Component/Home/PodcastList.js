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
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import Badge from '@material-ui/core/Badge';

const useStyles = makeStyles((theme)=>({
    root: {
      minWidth: 275,
      marginTop: 100,
      marginBottom: 150
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
        width: theme.spacing(10),
        height: theme.spacing(10),
        marginRight: theme.spacing(2)
      },
  })
  );


  const PodcastList = (props) => {
    const classes = useStyles();  
    const [haveNewEP, setHaveNewEP] = useState(false);
    const [intro, setIntro] = useState(props.podcastIntro.length>=45 ? props.podcastIntro.substring(0, 45) + "......" : props.podcastIntro);
    const [podcastName, setPodcastName] = useState(props.podcastName.length>=15 ? props.podcastName.substring(0, 14) + "......" : props.podcastName);
    useEffect(
      ()=>{
        if (props.haveNewEP!==false && props.haveNewEP!==undefined) {
          setHaveNewEP(true);
        }
      }
    )
    return (
        <div>
            <ListItem component={RLink} to={"/podcast/" + props.podcastId} alignItems="flex-start">
                <ListItemAvatar>
                  { haveNewEP ? 
                    <Badge
                    color="primary" badgeContent="新單集"
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}>
                        <Avatar variant="rounded" className={classes.large} alt={props.podcastName} src={props.podcastCover} />
                    </Badge>
                  :
                  <Avatar variant="rounded" className={classes.large} alt={props.podcastName} src={props.podcastCover} />
                }
                </ListItemAvatar>
                <ListItemText
                secondary={
                    <React.Fragment>
                    <Typography
                        component="span"
                        variant="h6"
                        color="textPrimary">
                        <Link component={RLink} to={"/podcast/" + props.podcastId}>{props.podcastName}</Link> 
                    </Typography>
                    <br/>
                    <Typography
                        component="span"
                        variant="body2"
                        color="textPrimary">
                    {intro}
                    </Typography>
                    </React.Fragment>
                }
                />
            </ListItem>
            <Divider/>
        </div>
    )
}
export default PodcastList;
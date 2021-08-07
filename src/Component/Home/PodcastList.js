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


  const PodcastList = (props) => {
    const classes = useStyles();  
    const [haveNewEP, setHaveNewEP] = useState(false);
    const [intro, setIntro] = useState(props.podcastIntro.length>=50 ? props.podcastIntro.substring(0, 49) + "⋯" : props.podcastIntro);
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
            <ListItem button component={RLink} to={"/podcast/" + props.podcastId} alignItems="flex-start">
                <ListItemAvatar>
                  { haveNewEP ? 
                    <Badge
                    color="primary"
                    badgeContent={"新單集"}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}>
                        <Avatar variant="rounded" className={classes.large} alt={props.podcastName} src={props.podcastCover==="" ? "." : props.podcastCover} />
                    </Badge>
                  :
                  <Avatar variant="rounded" className={classes.large} alt={props.podcastName} src={props.podcastCover} />
                }
                </ListItemAvatar>
                <ListItemText
                secondary={
                    <React.Fragment>
                    <Link variant="body1" underline="none">{props.podcastName}</Link> 
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
            <Divider/>
        </div>
    )
}
export default PodcastList;
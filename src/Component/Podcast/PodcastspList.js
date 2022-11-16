//react
import React, { useState, useEffect } from 'react'
import { Link as RLink } from 'react-router-dom';
//ui
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import EventIcon from '@material-ui/icons/Event';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Tooltip from '@material-ui/core/Tooltip';


const PodcastspList = (props)=>{

    const toDataTime = (sec)=>{
        var t = new Date(Date.UTC(1970, 0, 1, 0, 0, 0))
        t.setUTCSeconds(sec);
        return new Intl.DateTimeFormat("zh-TW" , {
            dateStyle: "short"
          }).format(t);
      }
    
    return(
    <>
        <ListItem button component={RLink} to={"/podcastdetail/" + props.userId + "/" + props.podId}>
            <ListItemText>
                <Typography variant="body2" component="span">
                    <ListItemIcon><EventIcon fontSize='small'/>{toDataTime(props.updateTime.seconds)}</ListItemIcon>
                    &nbsp;
                    <ListItemIcon><AccessTimeIcon fontSize='small'/>{props.duration}</ListItemIcon>
                </Typography>
                <br/>
                <Link style={{ display:"-webkit-box", overflow:"hidden", whiteSpace: "normal", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }} variant="subtitle1" underline="none">{props.podTitle}</Link>
                <Typography style={{ display:"-webkit-box", overflow:"hidden", whiteSpace: "normal", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }} variant="body2" component="span">{props.intro}</Typography>
            </ListItemText>
            <ListItemSecondaryAction>
                <Tooltip title="播放">
                    <IconButton 
                    aria-label="play"
                    value={props.podId}
                    data-uri={props.audioUrl}
                    data-coveruri={props.podIcon}
                    data-titlename={props.podTitle}
                    data-podcastname={props.channelName}
                    data-poduserid = { props.userId }
                    onClick={props.setPlayer}
                    edge="end"
                    size="large"
                    >
                        <PlayArrowIcon />
                    </IconButton>
                </Tooltip>
            </ListItemSecondaryAction>
        </ListItem>
        <Divider/>
    </>
    )
}
export default PodcastspList;
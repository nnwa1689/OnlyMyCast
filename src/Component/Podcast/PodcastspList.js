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


const PodcastspList = (props)=>{

    const [title, setTitle] = useState( props.podTitle.length >= 30 ? props.podTitle.substring(0,29) + "⋯" : props.podTitle);

    const toDataTime = (sec)=>{
        var t = new Date(Date.UTC(1970, 0, 1, 0, 0, 0))
        t.setUTCSeconds(sec);
        return new Intl.DateTimeFormat("zh-TW" , {
            dateStyle: "short"
          }).format(t);
      }
    
    return(
    <>
        <ListItem>
            <ListItemText>
                <Link component={RLink} to={"/podcastdetail/" + props.userId + "/" + props.podId} variant="body1">
                    {title}</Link><br/>
                <Typography variant="subtitle2" component="span">
                    <ListItemIcon><EventIcon fontSize="small"/>
                    {toDataTime(props.updateTime.seconds)}</ListItemIcon>
                    &nbsp;
                    <ListItemIcon><AccessTimeIcon fontSize="small"/>
                    {props.duration}
                    </ListItemIcon>
                </Typography>
            </ListItemText>
            <ListItemSecondaryAction>
                    <IconButton 
                    aria-label="play"
                    value={props.podId}
                    data-uri={props.audioUrl}
                    data-coveruri={props.podIcon}
                    data-titlename={props.podTitle}
                    data-podcastname={props.channelName}
                    onClick={props.setPlayer}
                    size="small"
                    >
                        <PlayArrowIcon/>
                    </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
        <Divider/>
    </>
    )
}
export default PodcastspList;
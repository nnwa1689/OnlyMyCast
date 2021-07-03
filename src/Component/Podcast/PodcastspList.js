import React from 'react'

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@material-ui/core/IconButton';
import { Link as RLink, useHistory } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';


const PodcastspList = (props)=>{
    
    return(
    <>
        {/*獨立出去 PodcastespListItem*/}
        <ListItem component="span">
            <ListItemIcon>
                <IconButton 
                aria-label="play"
                value={props.podId}
                data-uri={props.audioUrl}
                data-coveruri={props.podIcon}
                data-titlename={props.podTitle}
                data-podcastname={props.channelName}
                onClick={props.setPlayer}>
                    <PlayArrowIcon/>
                </IconButton>
            </ListItemIcon>
            <ListItemText>
                <Link component={RLink} to={"/podcastdetail/" + props.userId + "/" + props.podId} variant="h6">{props.podTitle}</Link><br/>
                <Typography variant="body1" component="span">{props.podIntro}</Typography>
            </ListItemText>
        </ListItem>
        <Divider/>
        {/*獨立出去 PodcastespListItem*/}
    </>
    )
}
export default PodcastspList;
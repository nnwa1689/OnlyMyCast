//react
import React from 'react'
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


const PodcastspList = (props)=>{

    const toDataTime = (sec)=>{
        var t = new Date(Date.UTC(1970, 0, 1, 0, 0, 0))
        t.setUTCSeconds(sec);
        return t.toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'},);
      }
    
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
                <Typography variant="body1" component="span"><ListItemIcon><AccessTimeIcon/>{toDataTime(props.updateTime.seconds)}</ListItemIcon></Typography>
                
            </ListItemText>
        </ListItem>
        <Divider/>
        {/*獨立出去 PodcastespListItem*/}
    </>
    )
}
export default PodcastspList;
//react
import React from 'react'
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
    return (
        <div>
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                <Avatar variant="rounded" className={classes.large} alt={props.podcastName} src={props.podcastCover} />
                </ListItemAvatar>
                <ListItemText
                secondary={
                    <React.Fragment>
                    <Typography
                        component="span"
                        variant="h5"
                        color="textPrimary">
                        <Link component={RLink} to={"/podcast/" + props.podcastId}>{props.podcastName}</Link> 
                    </Typography>
                    <br/>
                    <Typography
                        component="span"
                        variant="body1"
                        color="textPrimary">
                    {props.podcastIntro.substring(0,50) + "......"}
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
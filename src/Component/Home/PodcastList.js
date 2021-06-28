import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Container } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import CastIcon from '@material-ui/icons/Cast';
import Link from '@material-ui/core/Link';
import { Link as RLink, useHistory } from 'react-router-dom';

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
    const history = useHistory();
  
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
                    {props.podcastIntro}
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
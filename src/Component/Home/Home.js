import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Container } from '@material-ui/core';
import CastIcon from '@material-ui/icons/Cast';
import Link from '@material-ui/core/Link';
import PodcastList from './PodcastList';


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

const Home = () => {

    const classes = useStyles();
  
    return (
        <Container maxWidth="sm">
            <Card className={classes.root}>
                <CardContent>
                <Typography variant="h5" component="h1">
                    <CastIcon/>你的電台
                </Typography>
                <Typography variant="body1" component="span">
                    <br/>你訂閱的電台都在這裡了，盡情享用吧～
                </Typography>
           
                <PodcastList podcastName="幹話電台" podcastLink="" podcastIntro="廢物再經營的電台" podcastCover="" podcastId="asc189"></PodcastList>

                <Typography variant="h2" component="h1" gutterBottom>
                    (＾ｰ^)ノ<br/>
                </Typography>
                <Typography variant="h5" component="span">
                    嗨<br/>你還沒有訂閱任何電台<br/>快去尋找屬於你的電台吧！
                </Typography>
                </CardContent>
            </Card>
        </Container>
    )
}
export default Home;
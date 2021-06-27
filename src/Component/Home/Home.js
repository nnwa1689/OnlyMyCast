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
                <List>

                    {/* 切開列表元件 podcastListComponent */}
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                        <Avatar variant="rounded" className={classes.large} alt="幹話電台" src="/static/images/avatar/1.jpg" />
                        </ListItemAvatar>
                        <ListItemText
                        secondary={
                            <React.Fragment>
                            <Typography
                                component="span"
                                variant="h5"
                                color="textPrimary">
                                <Link href="#">
                                幹話電台
                                </Link> 
                            </Typography>
                            <br/>
                            <Typography
                                component="span"
                                variant="body1"
                                color="textPrimary">
                            {"太無聊了想聽廢話嗎？快來聽聽看這一些笑死你的廢話吧"}
                            </Typography>
                            </React.Fragment>
                        }
                        />
                    </ListItem>
                    <Divider/>

                    {/* 切開列表元件 podcastListComponent */}
                </List>


                <Typography variant="h2" component="h1" gutterBottom>
                    ╮(╯▽╰)╭ <br/>
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
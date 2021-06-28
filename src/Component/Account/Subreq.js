import React, { useState } from 'react'
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { deepOrange } from '@material-ui/core/colors';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';


const useStyles = makeStyles((theme)=>({
    root: {
        minWidth: 275,
        marginTop: 100,
        marginBottom: 150,
        alignItems:"center",
        textAlign:"center"
    },
    appBar: {
      top: 'auto',
      bottom: 0,
      alignItems:"center"
    },
    large: {
      width: theme.spacing(20),
      height: theme.spacing(20),
      marginBottom: theme.spacing(3),
      marginTop:theme.spacing(3),
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
      marginLeft:"auto",
      marginRight:"auto"
    },
    orange: {
        color: theme.palette.getContrastText(deepOrange[500]),
        backgroundColor: deepOrange[500],
      },
    button: {
      margin: theme.spacing(0),
    },
    margin: {
        marginBottom: theme.spacing(2),
        marginTop:theme.spacing(2)
      },
  }));

const Subreq = () => {
    const classes = useStyles();
    const [name, setName] = useState();
    const [avatar,setAvatar] = useState();
    const [intro, setIntro] = useState();
    const [oldPassword, setOldPassword] = useState();

    const sucReq= (e)=>{

    }

    const rejReq= (e)=>{

    }

    return(

        <Container maxWidth="sm">
            <Card className={classes.root}>
                <CardContent>
                <Typography variant="h5" component="h1">訂閱審核</Typography>
                <Typography variant="body1" component="span">允許或拒絕電台追蹤要求</Typography>
                <List dense>
                        <ListItem>
                            <ListItemAvatar>
                            <Avatar alt="啊" src={""}/>
                            </ListItemAvatar>
                            <ListItemText
                                primary="垃圾廢物的人"
                            />
                            <ListItemSecondaryAction>
                            <IconButton className={classes.button} variant="contained" color="primary" >
                                <CheckCircleIcon />
                            </IconButton>
                            <IconButton
                                variant="contained"
                                color="secondary"
                                className={classes.button}>
                                    <DeleteIcon />
                            </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                            <Avatar alt="啊" src={""}/>
                            </ListItemAvatar>
                            <ListItemText
                                primary="垃圾廢物的人"
                            />
                            <ListItemSecondaryAction>
                            <IconButton className={classes.button} variant="contained" color="primary" >
                                <CheckCircleIcon />
                            </IconButton>
                            <IconButton
                                variant="contained"
                                color="secondary"
                                className={classes.button}>
                                    <DeleteIcon />
                            </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                            <Avatar alt="啊" src={""}/>
                            </ListItemAvatar>
                            <ListItemText
                                primary="垃圾廢物的人"
                            />
                            <ListItemSecondaryAction>
                            <IconButton className={classes.button} variant="contained" color="primary" >
                                <CheckCircleIcon />
                            </IconButton>
                            <IconButton
                                variant="contained"
                                color="secondary"
                                className={classes.button}>
                                    <DeleteIcon />
                            </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>

                        <Typography variant="h2" component="h1" gutterBottom>
                            ╮(╯▽╰)╭ <br/>
                        </Typography>
                        <Typography variant="h5" component="span">
                            呼～喘口氣<br/>目前沒有任何訂閱要求<br/>喝杯茶再回來吧～
                        </Typography>
                </List>

                </CardContent>
            </Card>
        </Container>


    );

}
export default Subreq;
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
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import { deepOrange } from '@material-ui/core/colors';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';


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
    menuButton: {
      margin: theme.spacing(1),
    },
    margin: {
        marginBottom: theme.spacing(2),
        marginTop:theme.spacing(2)
      },
  }));

  const theme = createMuiTheme({
    palette: {
    primary: {
        main: "#ff9800",
    },
    secondary: {
        main: "#ff3d00",
    },
    white:{
        main: "#00000"
    }
    },
});

const PodcastAccount = () => {
    const classes = useStyles(theme);
    const [name, setName] = useState();
    const [avatar,setAvatar] = useState();
    const [intro, setIntro] = useState();
    const [oldPassword, setOldPassword] = useState();

    return(
        <ThemeProvider theme={theme}>
            <Container maxWidth="sm">
                <Card className={classes.root}>
                    <CardContent>
                    <Typography variant="h5" component="h1">電台設定</Typography>
                    <Typography variant="body1" component="span">更新您的電台資訊<br/>這裡的資訊將於電台首頁公布</Typography>
                    <Avatar alt="啊哈（白痴怪談）" src={avatar} className={classes.large} />
                    <form noValidate autoComplete="off">
                    <FormControl fullWidth className={classes.margin}>
                        <TextField value={avatar} onChange={(e)=>setAvatar(e.target.value)} id="outlined-basic" label="電台Icon" variant="outlined" />
                    </FormControl>
                    <FormControl fullWidth className={classes.margin}>
                        <TextField value={name} onChange={(e)=>setName(e.target.value)} id="outlined-basic" label="電台名稱" variant="outlined" />
                    </FormControl>
                        <FormControl fullWidth className={classes.margin}>
                        <TextField
                            id="outlined-multiline-static"
                            label="電台介紹"
                            multiline
                            rows={6}
                            value={intro}
                            onChange={(e)=>setIntro(e.target.value)}
                            variant="outlined"
                            />                    
                        </FormControl>      
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            className={classes.button}
                            startIcon={<SaveIcon />}>
                            儲存設定
                        </Button>
                        <br/><br/>
                        </form>
                    <Divider/>
                    <Typography variant="h5" component="h1"><br/>追蹤管理</Typography>
                    <Typography variant="body1" component="span">移除已經被允許追蹤的人</Typography>
                    <List dense>
                            <ListItem>
                                <ListItemAvatar>
                                <Avatar alt="啊" src={""}/>
                                </ListItemAvatar>
                                <ListItemText
                                    primary="垃圾廢物的人"
                                />
                                <ListItemSecondaryAction>
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
                                <IconButton
                                    variant="contained"
                                    color="secondary"
                                    className={classes.button}>
                                        <DeleteIcon />
                                </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                            
                    </List>
       
                    </CardContent>
                </Card>
            </Container>
        </ThemeProvider>


    );

}
export default PodcastAccount;
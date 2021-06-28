import React, { useState } from 'react'
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
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
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';


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


const PodcastHome = (props) => {
    const classes = useStyles();
    const [name, setName] = useState();
    const [avatar,setAvatar] = useState();
    const [intro, setIntro] = useState();

    //get 此頻道資料  是否被目前使用者訂閱（

    const handlePlayEvent = (e)=>{
        console.log(e.currentTarget.value);

    }

    const handleUnsub = (e) => {

    }

    const handleSub = (e) => {

    }

    const handleRemoveReq = (e) => {

    }


    return(

        <Container maxWidth="sm">
            <Card className={classes.root}>
                <CardContent>
                
                <Avatar variant="rounded" alt="啊哈（白痴怪談）" src={avatar} className={classes.large} />
                <Typography variant="h5" component="h1">哈囉白痴</Typography>
                <Typography variant="body1" component="span">聽這個電台的都是白癡</Typography>
                <br/><br/>
                <Button onClick={(e)=>handleSub(e)} variant="outlined" color="primary" size="large" startIcon={<StarIcon />}>
                    要求追蹤
                </Button>
                <Button onClick={(e)=>handleUnsub(e)} variant="outlined" color="secondary" size="large" startIcon={<StarBorderIcon />}>
                    取消追蹤
                </Button>

                <Button variant="outlined" size="large" onClick={(e)=>handleRemoveReq(e)}>已送出請求</Button>
                <br/>
                <br/>
                <Divider/>
                <ListItem
                component="button" 
                button
                value="hashPod"
                data-uri="https://firebasestorage.googleapis.com/v0/b/noteshazuya.appspot.com/o/%E5%85%89%E8%89%AF%20Michael%20Wong%E6%9B%B9%E6%A0%BC%20Gary%20Chaw%E3%80%90%E5%B0%91%E5%B9%B4%E3%80%91Official%20Music%20Video.mp3?alt=media&token=44b2b151-45c2-4997-aa5a-9b01c95b5d49"
                data-coveruri="https://img.mymusic.net.tw/mms/album/L/036/36.jpg"
                data-titlename="少年"
                data-podcastname="幹話"
                onClick={props.setPlayer}
                >
                    <ListItemIcon>
                        <PlayArrowIcon />
                    </ListItemIcon>
                    <ListItemText>
                        <Typography variant="h6" component="h1">哈囉白痴</Typography>
                        <Typography variant="body1" component="span">這是白癡電台的第一個廣播，請多多指教哦哦哦！！！！</Typography>
                    </ListItemText>
                </ListItem>
                <Divider/>
                

                </CardContent>
            </Card>
        </Container>


    );

}
export default PodcastHome;
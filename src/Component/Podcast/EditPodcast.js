import React, { useState, useRef, useEffect } from 'react'
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
import { Link as RLink, useHistory } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import EditIcon from '@material-ui/icons/Edit';
import CircularProgress from '@material-ui/core/CircularProgress';


import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/database"

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


const EditPodcast = (props) => {

    const classes = useStyles();
    const [spList, setSpList] = useState();
    const isFirstLoad = useRef(true);

    useEffect(
        ()=>{
            if (isFirstLoad.current) {
                if (props.user.userId !== "") {
                    getPodcastList();
                }
                isFirstLoad.current = false;
            }
        }
    )

    const toDataTime = (sec)=>{
        var t = new Date(Date.UTC(1970, 0, 1, 0, 0, 0))
        t.setUTCSeconds(sec);
        return t.toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'},);
      }

    const getPodcastList = ()=>{
        var changeArr = Array();
        firebase.firestore().collection("podcast").doc(props.user.userId).collection('podcast').orderBy('updateTime', 'desc').get()
        .then(async(e)=>{
            if (e.docs.length ===0) {
                setSpList("")
            } else {
                for (var doc of e.docs) {
                    changeArr.push(
                        <>
                        <ListItem key={doc.id} component="span">
                            <ListItemText>
                                <Link component={RLink} to={"/podcastdetail/"+ props.user.userId + "/" + doc.id} variant="h6">{doc.data().title}</Link><br/>
                                <Typography variant="body2" component="datetime">發佈於 {toDataTime(doc.data().updateTime.seconds)}</Typography>
                            </ListItemText>
                            <ListItemIcon>
                                <IconButton 
                                aria-label="play"
                                value={doc.id}
                                component={RLink}
                                to={"/editpodcast/"+ props.user.userId + "/" + doc.id}
                                >
                                    <EditIcon/>
                                </IconButton>
                            </ListItemIcon>
                        </ListItem>
                        <Divider/>
                        </>
                    )
                }  
            }
        }).then(()=>{
            setSpList(changeArr);
        })
    }

    if (props.user.userId==="") {
        return(
            <Container maxWidth="sm">
                <Card className={classes.root}>
                    <CardContent>
                        <Typography variant="h2" component="h1" gutterBottom>
                            (＾ｰ^)ノ<br/>
                        </Typography>
                        <Typography variant="h5" component="span">
                            嗨<br/>你還沒有建立電台 ╮(╯▽╰)╭<br/>                            
                        </Typography>
                        <br/>
                        <Button
                            component={RLink}
                            to="/podcastaccount"
                            color="primary"
                            fullWidth
                            size="large"
                            variant="contained"
                            >              
                            立即建立屬於我的私人電台
                            </Button>
                    </CardContent>
                </Card>
            </Container>
        )} else {
            if (spList===undefined) {
                return(<CircularProgress style={{marginTop: "25%"}} />);
            } else {
                return(
                    <Container maxWidth="sm">
                        <Card className={classes.root}>
                            <CardContent>
                            <Typography variant="h5" component="h1">單集管理</Typography><br/>
                            <Typography variant="body1" component="span">修改或刪除您電台的單集以及單集簡介</Typography>
                            <br/>
                            <br/>
                            <Divider/>
                            {spList==="" || spList.length===0 ? 
                                <Button
                                component={RLink}
                                to="/uploadpodcast"
                                color="primary"
                                fullWidth
                                size="large"
                                variant="contained"
                                >              
                                立即新增節目
                                </Button>
                            :
                            spList
                            }
                            </CardContent>
                        </Card>
                    </Container>
                );
            }
        }
}
export default EditPodcast;
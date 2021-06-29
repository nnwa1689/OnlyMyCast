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
import { Link as RLink, useHistory } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import EditIcon from '@material-ui/icons/Edit';



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
    const history = useHistory();
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
                
                <Typography variant="h5" component="h1">單集管理</Typography><br/>
                <Typography variant="body1" component="span">修改或刪除您電台的單集以及單集簡介</Typography>
                <br/>
                <br/>
                <Divider/>

                {/*獨立出去 PodcastespEditListItem
                props hashvalue*/}
                <ListItem component="span">
                    <ListItemText>
                        <Typography component="span" to={"/podcastdetail/" + "flkj"} variant="h6">哈囉白痴</Typography><br/>
                        <Typography variant="body2" component="datetime">發佈於 {"2020/202/"}</Typography>
                    </ListItemText>
                    <ListItemIcon>
                        <IconButton 
                        aria-label="play"
                        value="hashPod"
                        component={RLink}
                        to={"/editpodcast/abc"}
                        >
                            <EditIcon/>
                        </IconButton>
                    </ListItemIcon>
                </ListItem>
                <Divider/>
                {/*獨立出去 PodcastespEditListItem*/}
                

                </CardContent>
            </Card>
        </Container>


    );

}
export default EditPodcast;
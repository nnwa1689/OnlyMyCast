import React, { useState } from 'react'
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { OutlinedInput } from '@material-ui/core';
import { InputLabel } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import { deepOrange } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Link as RLink, useHistory } from 'react-router-dom';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import AttachmentIcon from '@material-ui/icons/Attachment';
import CircularProgress from '@material-ui/core/CircularProgress';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';

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
    backButton: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    input: {
        display: 'none',
      },
      margin: {
        marginBottom: theme.spacing(2),
        marginTop:theme.spacing(2)
      },
  })
  );

  const EditPodcastDetails = (props) => {

    const classes = useStyles();
    const history = useHistory();
    const [activeStep, setActiveStep] = useState(0);
    const [filename, setFilename] = useState("");
    const [fileBit, setFileBit] = useState();
    const [intro, setIntro] = useState("");
    const [podcastTitle, setPodcastTitle] = useState("");
    const [uploadStatu, setUploadStatu] = useState(0);
    //0:init 1:suc 2:uploading 3:err

    const handleUpdatePodcast = () => {
        var file = new File([fileBit], filename);
        console.log(file);
        setActiveStep(3);
        setUploadStatu(2);
    }

    const handleDelPodcast = () => {

    }

    return(
        <Container maxWidth="sm">
            <Card className={classes.root}>
                <CardContent>
                <Typography variant="h5" component="h1">編輯單集</Typography>
                <Typography variant="body1" component="span">刪除或編輯這個單集</Typography>

                    <FormControl fullWidth className={classes.margin}>
                        <TextField value={podcastTitle} onChange={(e)=>setPodcastTitle(e.target.value)} id="outlined-basic" label="單集標題" variant="outlined" />
                    </FormControl>
                    <FormControl fullWidth className={classes.margin}>
                        <TextField
                            id="outlined-multiline-static"
                            label="單集介紹"
                            multiline
                            rows={6}
                            value={intro}
                            onChange={(e)=>setIntro(e.target.value)}
                            variant="outlined"
                            />                    
                    </FormControl>
                    <FormControl fullWidth className={classes.margin}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        className={classes.button}
                        startIcon={<SaveIcon />}
                        onClick={handleUpdatePodcast}
                    >
                        變更單集資訊
                    </Button>
                    <br/>
                    <Button
                        variant="contained"
                        color="secondary"
                        className={classes.button}
                        startIcon={<DeleteIcon />}
                        onClick={handleDelPodcast}
                        size="large"
                    >
                        刪除單集
                    </Button> 
                    </FormControl>   
                </CardContent>
            </Card>
        </Container>
    );

}
export default EditPodcastDetails;
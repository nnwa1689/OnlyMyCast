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

  const NewPodcast = (props) => {

    const classes = useStyles();
    const history = useHistory();
    const [activeStep, setActiveStep] = useState(0);
    const [filename, setFilename] = useState("");
    const [fileBit, setFileBit] = useState();
    const [intro, setIntro] = useState("");
    const [podcastTitle, setPodcastTitle] = useState("");
    const [uploadStatu, setUploadStatu] = useState(0);
    //0:init 1:suc 2:uploading 3:err

    const handleUploadPodcast = () => {
        var file = new File([fileBit], filename);
        console.log(file);
        setActiveStep(3);
        setUploadStatu(2);
    }

    return(
        <Container maxWidth="sm">
            <Card className={classes.root}>
                <CardContent>
                <Typography variant="h5" component="h1">新增單集</Typography>
                <Typography variant="body1" component="span">依照步驟來新增您電台的單集</Typography>
                
                <Stepper activeStep={activeStep} alternativeLabel>
                    <Step key={0}>
                        <StepLabel>{"選擇預錄好的音檔"}</StepLabel>
                    </Step>
                    <Step key={1}>
                        <StepLabel>{"設定單集相關資訊"}</StepLabel>
                    </Step>
                    <Step key={2}>
                        <StepLabel>{"準備上傳"}</StepLabel>
                    </Step>
                </Stepper>

                { activeStep === 0 &&
                (<>
                     <input
                        accept=".mp3, image/*"
                        className={classes.input}
                        id="contained-button-file"
                        multiple
                        type="file"
                        startIcon={<AttachmentIcon />}
                        onChange={(e)=>{
                            console.log(e.target.files);
                            if (e.target.files.length >= 1) {
                                setFilename(e.target.files[0].name);
                                setFileBit(e.target.files[0])
                            }
                        }}
                    />
                    <label htmlFor="contained-button-file">
                        <Button variant="contained" size="large" color="primary" component="span">
                            <AttachmentIcon />
                            { filename === "" ? "選擇檔案" : filename }</Button>
                    </label>
                    <br/>
                </>)
                }

                { activeStep === 1 &&
                (
                    <>
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
                    </>
                )
                 }

                { activeStep === 2 &&
                (
                    <>
                        <Typography variant="h1" gutterBottom>
                            （*＾3＾） 
                        </Typography>
                        <br/>
                        <Typography variant="h6" gutterBottom>
                            你的單集上傳已經準備就緒，按下完成後就會開始上傳，期間請不要關閉瀏覽器！  
                        </Typography>
                     
                    </>
                )
                 }

                { uploadStatu === 2 && 
                    <>
                        <CircularProgress size={80} />
                        <Typography variant="h6" gutterBottom>
                            正在處理上傳作業，請稍候！ 
                        </Typography>
                    </>
                }

                <br/><br/>

                { activeStep < 3 &&
                    <>
                        <Divider/>
                        <br/>
                        <Button
                            disabled={activeStep === 0}
                            onClick={()=>setActiveStep(activeStep - 1)}
                            className={classes.backButton}
                        >
                            上一步
                        </Button>
                        {activeStep === 2 ? 
                        <Button variant="contained" color="primary" onClick={()=>handleUploadPodcast()}>
                            完成
                        </Button>
                        :
                        <Button disabled={ (filename==="" && activeStep===0) || (podcastTitle===""&& activeStep===1) || (intro==="" && activeStep===1) } variant="contained" color="primary" onClick={()=>setActiveStep(activeStep + 1)}>
                            下一步
                        </Button>
                        }
                    </>
                }
 
  
                </CardContent>
            </Card>
        </Container>
    );

}
export default NewPodcast;
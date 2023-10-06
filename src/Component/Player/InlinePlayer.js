//react
import React, { useState, createRef, useEffect } from 'react';
//ui
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import Slider from '@material-ui/core/Slider';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import Tooltip from '@material-ui/core/Tooltip';
import ReactPlayer from 'react-player'
import Typography from '@material-ui/core/Typography';
import Replay10Icon from '@material-ui/icons/Replay10';
import Forward10Icon from '@material-ui/icons/Forward10';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme)=>({
  root: {
    width: "100%",
    position:"absolute",
    bottom:0
  },
  appBar: {
    top: 'auto',
    bottom: 0,
    alignItems:"center"
  },
  large: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginTop: theme.spacing(2)
  },  
  menuButton: {
    margin: theme.spacing(1),
  },
}));

const InlinePlayer = (props) => {
    const classes = useStyles();
    const [playState, setPlayState] = useState(false);
    const [playSec, setPlaySec] = useState(0);
    const [duration, setDuration] = useState(0);
    const playerRef = createRef();
    const [ready, setReady] = useState(false);

    useEffect(
        ()=>{
            setReady(false);
            setPlayState(false);
            console.log(duration);
        },[props.url]
    )

    useEffect(
        ()=>{props.returnDuration(duration);}
    )
    

    const handleNextTenClick= (e)=>{
        playerRef.current.seekTo(playSec.playedSeconds + 10)
    }

    const handleBackTenClick=(e)=>{
        playerRef.current.seekTo(playSec.playedSeconds - 10)
    }

    const handlePlayClick=()=>{
        setPlayState(!playState);
    }

    const handlePauseClick=()=>{
        setPlayState(!playState);
    }

    const setPlayerOnSeek = (e, newValue) => {
        playerRef.current.seekTo(newValue/100, "fraction");
    }

    const setPlayerSec = (e, newValue) => {
        setPlaySec(newValue/100*duration);
    }

    return (
        <>
        {props.children}
        {
        (props.url !== undefined && props.url !== "") &&
        <>
            <ReactPlayer 
                ref={playerRef}
                url={props.url}
                onReady={()=>setReady(true)}
                onPause={()=>setPlayState(false)}
                onPlay={()=>setPlayState(true)}
                width="0"
                height="0"
                onProgress={(p)=>(setPlaySec(p.playedSeconds))}
                onDuration={(d)=>(setDuration(d))}
                volume={1}
                playing={playState}
                config={{ file:{ forceAudio:true } }}
            />
            <Paper variant="outlined" style={{ paddingTop: 0, margin: "10px" }}>
                { !ready ? <LinearProgress style={{width:"100%"}}/>
                :
                <Slider 
                    style={{padding: -10,}} 
                    step={1} 
                    min={0} 
                    max={100} 
                    onChangeCommitted={(e, newValue)=>{setPlayerOnSeek(e, newValue)}} 
                    defaultValue={0} 
                    onChange={(e, newValue)=>{setPlayerSec(e, newValue); console.log(playSec, duration)}} 
                    value={playSec!==undefined ? (playSec/duration)*100:0}/>
                }
                <Typography className="playTime" variant="subtitle2">
                    { parseInt(((parseInt(playSec, 10))/60)) + ":" + Math.ceil(((parseInt(playSec, 10))%60))}
                    { " / " + parseInt(duration/60, 10) + ":" + Math.ceil(parseInt(duration, 10)%60)}
                    {"，容量：" + Math.round((props.fileSize/1024/1024)*100)/100 + "MB"}

                    { (playState) ? 
                    <Tooltip onClick={ handlePauseClick } title="暫停" aria-label="pause" size="small">
                        <IconButton className={classes.menuButton}  color="inherit">
                            <PauseCircleFilledIcon />
                        </IconButton>
                    </Tooltip>
                    : 
                    <Tooltip onClick={ handlePlayClick } title="播放" aria-label="play" size="small">
                        <IconButton className={classes.menuButton}  color="inherit">
                            <PlayCircleFilledIcon />
                        </IconButton>
                    </Tooltip>
                    }
                </Typography>
            </Paper>
        </>
        }
        </>
    );
    }
export default InlinePlayer;
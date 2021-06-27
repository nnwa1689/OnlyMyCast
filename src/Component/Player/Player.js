import React, { useState, createRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar'
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import Avatar from '@material-ui/core/Avatar';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import Tooltip from '@material-ui/core/Tooltip';
import ReactPlayer from 'react-player'
import Typography from '@material-ui/core/Typography';

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

const Player = (props) => {
    const classes = useStyles();
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

    const [playState, setPlayState] = useState(true);
    const [playSec, setPlaySec] = useState(0);
    const [duration, setDuration] = useState(0);
    const playerRef = createRef();

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

    return (
        <>
        {props.children}  
        <ReactPlayer 
            ref={playerRef}
            url={props.url}
            playing={playState}
            onReady={()=>console.log('ready')}
            onPause={()=>setPlayState(false)}
            onPlay={()=>console.log('play')}
            width="0"
            height="0"
            onProgress={(p)=>(setPlaySec(p))}
            onDuration={(d)=>(setDuration(d))}
            volume={1}
            />
        <ThemeProvider theme={theme}>
            <AppBar position="fixed" color="white" className={classes.appBar}>
                <Toolbar variant="dense">
                    <Avatar variant="rounded" className={classes.large} alt="幹話電台" src={props.coverUrl} />
                    <Typography style={{ marginTop: theme.spacing(2) } } variant="subtitle2">
                        {props.singleName} - {props.podcastName}
                    </Typography>
                    <Typography className="playTime" style={{ marginTop: theme.spacing(2) } } variant="subtitle2">
                        ({ "-" + parseInt(((parseInt(duration, 10) - parseInt(playSec.playedSeconds, 10))/60)) + ":" + parseInt(((parseInt(duration, 10) - parseInt(playSec.playedSeconds, 10))%60))})
                    </Typography>
                </Toolbar>
                <Toolbar variant="dense">
                    <Tooltip onClick={ handleBackTenClick } title="倒退10秒" aria-label="back10s">
                        <IconButton className={classes.menuButton} edge="end" color="inherit">
                            <SkipPreviousIcon />
                        </IconButton>  
                    </Tooltip>
                    { (playState) ? 
                    <Tooltip onClick={ handlePauseClick } title="暫停" aria-label="pause">
                        <IconButton className={classes.menuButton}  color="inherit">
                            <PauseCircleFilledIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                    : 
                    <Tooltip onClick={ handlePlayClick } title="播放" aria-label="play">
                        <IconButton className={classes.menuButton}  color="inherit">
                            <PlayCircleFilledIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                    }
                    <Tooltip onClick={ handleNextTenClick } title="向前10秒" aria-label="next10s">
                        <IconButton className={classes.menuButton}  edge="end" color="inherit">
                            <SkipNextIcon />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>
        </ThemeProvider>
        </>
    );
    }

export default Player;
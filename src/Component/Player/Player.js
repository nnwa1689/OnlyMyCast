//react
import React, { useState, createRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
//ui
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import Toolbar from '@material-ui/core/Toolbar'
import Avatar from '@material-ui/core/Avatar';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import Tooltip from '@material-ui/core/Tooltip';
import ReactPlayer from 'react-player'
import Typography from '@material-ui/core/Typography';
import Replay10Icon from '@material-ui/icons/Replay10';
import Forward10Icon from '@material-ui/icons/Forward10';
import LinearProgress from '@material-ui/core/LinearProgress';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';
import VolumeUp from '@material-ui/icons/VolumeUp';
import Box from '@material-ui/core/Box';


const useStyles = makeStyles((theme)=>({
  root: {
    width: "9%",
    position:"absolute",
    bottom:0
  },
  appBar: {
    top: 'auto',
    bottom: 0,
    alignItems:"center",
    paddingBottom: 5
  },
  podcastToolbar: {
    justifyContent: "flex-start",
  },
  controlItemToolbar: {
    justifyContent: "center",
  },
  speedToolbar: {
    justifyContent: "flex-end",
  },
  large: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    backgroundColor: "#FD3E49",
  },  
  menuButton: {
    margin: theme.spacing(1),
  },
  epTitleBox:{
    width: "100%",
    overflow: "hidden",
    margin: theme.spacing(1),
  },
  epTitle:{
    display: "inline-block",
    whiteSpace: "nowrap",
    animation: "floatText 15s infinite linear",
  },
  isAuthContent: {
    [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${240}px)`,
        marginLeft: 240,
    },
  }
}));

const darkAppbarStyle = { backgroundColor: "rgba(0, 0, 0, 1)", };
const lightAppbarStyle = { backgroundColor: "rgba(255, 255, 255, 1)", }


const Player = (props) => {
    const classes = useStyles();
    const [playState, setPlayState] = useState(true);
    const [playSec, setPlaySec] = useState(0);
    const [duration, setDuration] = useState(0);
    const playerRef = createRef();
    const [ready, setReady] = useState(false);
    const [singleName, setSingleName] = useState();
    const [podcastName, setPodcastName] = useState();
    const [playBackRate, setPlayBackRate] = useState(1);
    const [loadedRate, setLoadedRate] = useState();
    const [volume, setVolume] = useState(1);
    const darkmode = useSelector(state => state.mode);

    useEffect(
        ()=>{
            setReady(false);
            setPlayState(true);
            setSingleName(props.singleName);
            setPodcastName(props.podcastName);
            setVolume(localStorage.getItem("volume") === null ? 1 : localStorage.getItem("volume"))
            //console.log(props.url);
        },[props.url]
    )

    const handleNextTenClick= (e)=>{
        playerRef.current.seekTo(playSec + 10)
    }

    const handleBackTenClick=(e)=>{
        playerRef.current.seekTo(playSec - 10)
    }

    const handlePlayClick=()=>{
        setPlayState(!playState);
    }

    const handlePauseClick=()=>{
        setPlayState(!playState);
    }

    const changePlayBackRate = (e) => {
        setPlayBackRate(e.target.value);
    }

    const setPlayerOnSeek = (e, newValue) => {
        playerRef.current.seekTo(newValue/100, "fraction");
    }

    const setPlayerSec = (e, newValue) => {
        setPlaySec(newValue/100*duration);
    }

    const handleVolumeChange = (e, newValue) => {
        setVolume(newValue);
        localStorage.setItem('volume', newValue);
    }

    return (
        <>
        {props.children}
        {
        (props.url !== undefined && props.url !== "") &&
        <>
        <style>
            {`
                @keyframes floatText {
                    from {
                        transform: translateX(100%);
                    }
                    to {
                        transform: translateX(-100%);
                    }
                }
            }`
            }
        </style>
            <ReactPlayer 
                ref={playerRef}
                url={props.url}
                onReady={()=>setReady(true)}
                onPause={()=>setPlayState(false)}
                onPlay={()=>setPlayState(true)}
                width="0"
                height="0"
                onProgress={(p)=>{
                    setPlaySec(p.playedSeconds);
                    setLoadedRate(p.loaded);
                }}
                onDuration={(d)=>(setDuration(d))}
                volume={volume}
                playing={playState}
                config={{ file:{ forceAudio:true } }}
                playbackRate={playBackRate}
            />
            <AppBar position="fixed" color="inherit" style={ darkmode === 'light' ? lightAppbarStyle : darkAppbarStyle } className={[classes.appBar, (props.isAuth && classes.isAuthContent)]}>
                { !ready ? <LinearProgress style={{width:"100%"}}/> : 
                    <Slider 
                    style={{padding: 0, paddingBottom: 2,}} 
                    step={1} 
                    min={0} 
                    max={100} 
                    onChangeCommitted={(e, newValue)=>{setPlayerOnSeek(e, newValue)}} 
                    defaultValue={0} 
                    onChange={(e, newValue)=>{setPlayerSec(e, newValue)}} 
                    value={playSec!==undefined ? (playSec/duration)*100:0}/>
                }
                <Grid container spacing={0} direction="row">
                    <Grid item xs={12} sm={4} md={4}>
                        <Toolbar className={classes.podcastToolbar}>
                            <Avatar variant="rounded" className={classes.large} alt={podcastName} src={props.coverUrl} />
                            <div className={classes.epTitleBox}>
                                <Typography className={classes.epTitle} variant="subtitle2">
                                    {podcastName} - {singleName}
                                </Typography>     
                            </div>
                            <Typography variant="subtitle2">
                                {parseInt(((parseInt(playSec, 10))/60)) + ":" + Math.ceil(((parseInt(playSec, 10))%60))}
                                /
                                { parseInt(parseInt(duration, 10)/60) + ":" + (parseInt(duration, 10)%60) }
                            </Typography>
                        </Toolbar>
                    </Grid>
                    <Grid item xs={5} sm={3} md={4}>
                        <Toolbar className={classes.controlItemToolbar}>                            
                            <Tooltip  display={{ xs: 'none', md: 'none' }} onClick={ handleBackTenClick } title="倒退10秒" aria-label="back10s">
                                <IconButton className={classes.menuButton} edge="start" color="inherit" size="small">
                                    <Replay10Icon fontSize="large"/>
                                </IconButton>  
                            </Tooltip>
                            { (playState) ? 
                            <Tooltip onClick={ handlePauseClick } title="暫停" aria-label="pause">
                                <IconButton className={classes.menuButton}  color="inherit" size="small">
                                    <PauseCircleFilledIcon fontSize="large" />
                                </IconButton>
                            </Tooltip>
                            : 
                            <Tooltip onClick={ handlePlayClick } title="播放" aria-label="play">
                                <IconButton className={classes.menuButton}  color="inherit" size="small">
                                    <PlayCircleFilledIcon fontSize="large" />
                                </IconButton>
                            </Tooltip>
                            }
                            <Tooltip onClick={ handleNextTenClick } title="向前10秒" aria-label="next10s">
                                <IconButton className={classes.menuButton}  edge="end" color="inherit" size="small">
                                    <Forward10Icon fontSize="large"/>
                                </IconButton>
                            </Tooltip>
                        </Toolbar> 
                    </Grid>
                    <Grid item xs={7} sm={5} md={4}>
                        <Toolbar className={classes.speedToolbar}>
                            <Grid container alignItems="center">
                                <Box display={{ xs: 'none',sm: 'contents', md: 'contents' }}>
                                    <Grid item sm={3} md={2}>
                                        <VolumeUp />
                                    </Grid>
                                    <Grid item sm={8} md={3}>
                                        <Slider
                                            value={volume}
                                            onChange={handleVolumeChange}
                                            step={0.01} 
                                            min={0} 
                                            max={1} 
                                        />
                                    </Grid>
                                </Box>
                            </Grid>
                        
                            <Select
                            value={playBackRate}
                            variant="outlined"
                            onChange={(e)=>{changePlayBackRate(e)}}
                            >
                                <MenuItem value={0.25}>x0.25</MenuItem>
                                <MenuItem value={0.5}>x0.5</MenuItem>
                                <MenuItem value={1}>x1.0</MenuItem>
                                <MenuItem value={1.5}>x1.5</MenuItem>
                                <MenuItem value={2.0}>x2.0</MenuItem>
                            </Select> 
                        </Toolbar>
                    </Grid>
                </Grid>
            </AppBar>
        </>
        }
        </>
    );
    }
export default Player;
//react
import React, { useState, useEffect, useRef } from 'react';
//ui
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ListItem } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import FacebookIcon from '@material-ui/icons/Facebook';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import InstagramIcon from '@material-ui/icons/Instagram';
import YouTubeIcon from '@material-ui/icons/YouTube';
import TwitterIcon from '@material-ui/icons/Twitter';
import Link from '@material-ui/core/Link';
//firebase
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/database";
//other
import { Helmet } from 'react-helmet';
//media images
import kklogo from '../../static/kkbox_app_icon.png';
import spotiflogo from '../../static/spotify.png';
import applelogo from '../../static/hero_icon__c135x5gz14mu_large_2x.png';
import googlelogo from '../../static/icons8-google-podcasts-48.png';
import soundonlogo from '../../static/soundon.png';
import omclogo from '../../static/logo192.png';


const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: 275,
        marginTop: 100,
        marginBottom: 50,
        borderRadius: "10px",
        alignItems: "center",
        textAlign: "center",
    },
    large: {
        width: theme.spacing(24),
        height: theme.spacing(24),
        marginTop: theme.spacing(2),
        color: "#FFFFFF",
        backgroundColor: "#FD3E49",
        marginLeft: "auto",
        marginRight: "auto"
    },
    markDownBlock: {
        color: "#000000"
    },
    facebookButton: {
        borderColor: "#4267B2",
        color: "#4267B2",
        marginTop: theme.spacing(1),
    },
    instagramButton: {
        borderColor: "#C13584",
        color: "#C13584",
        marginTop: theme.spacing(1),
    },
    youtubeButton: {
        borderColor: "#FF0000",
        color: "#FF0000",
        marginTop: theme.spacing(1),
    },
    twitterButton: {
        borderColor: "#1DA1F2",
        color: "#1DA1F2",
        marginTop: theme.spacing(1),
    },
    appleColor: {
        borderColor: "#872EC4",
        color: "#872EC4",
        marginTop: theme.spacing(1),
    },
    googleColor: {
        borderColor: "#1565C0",
        color: "#1565C0",
        marginTop: theme.spacing(1),
    },
    spotifyColor: {
        borderColor: "#000000",
        color: "#1DB954",
        marginTop: theme.spacing(1),
    },
    kkColor: {
        borderColor: "#09CEF6",
        color: "#09CEF6",
        marginTop: theme.spacing(1),
    },
    onlymycastColor: {
        borderColor: "#FD3E49",
        color: "#FD3E49",
        marginTop: theme.spacing(1),
    }
}));


const Onelink = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("");
    const [podcasterName, setPodcasterName] = useState(0);
    const [podcasterAvatar, setPodcasterAvatar] = useState(0);
    //0:init 1:sub 2:unsub 3:req
    const isFirstLoad = useRef(true);
    const [facebookLink, setFacebookLink] = useState("");
    const [youtubeLink, setYoutubeLink] = useState("");
    const [instagramLink, setInstagramLink] = useState("");
    const [twitterLink, setTwitterLink] = useState("");
    const [applepodcastLink, setApplepodcastLink] = useState();
    const [googlepodcastLink, setGooglepodcastLink] = useState();
    const [spotifyLink, setSpotifyLink] = useState();
    const [kkLink, setKkLink] = useState();
    const [soundonLink, setSoundonLink] = useState();
    const omcLink = props.baseWwwUrl + "podcast/" + props.match.params.id;


    useEffect(
        () => {
            //get 此頻道資料  是否被目前使用者訂閱
            if (isFirstLoad.current) {
                getChannleData();
                window.scrollTo(0, 0);
                isFirstLoad.current = false;
            }
        }
    )


    const getChannleData = () => {
        firebase.firestore().collection("channel").doc(props.match.params.id).get()
            .then(
                (doc) => {
                    if (doc.exists) {
                        const data = doc.data();
                        //podcast擁有者
                        firebase.firestore().collection("user").doc(data.uid).get()
                            .then(
                                (doc) => {
                                    const data = doc.data();
                                    setPodcasterAvatar(data.avatar);
                                    setPodcasterName(data.name);
                                }
                            );
                        setName(data.name);
                        setAvatar(data.icon);
                        setFacebookLink(data.facebook !== undefined && data.facebook);
                        setInstagramLink(data.instagram !== undefined && data.instagram);
                        setYoutubeLink(data.youtube !== undefined && data.youtube);
                        setTwitterLink(data.twitter !== undefined && data.twitter);
                        setApplepodcastLink(data.applepodcast === undefined ? "" : data.applepodcast);
                        setGooglepodcastLink(data.googlepodcast === undefined ? "" : data.googlepodcast);
                        setSpotifyLink(data.spotify === undefined? "" : data.spotify);
                        setKkLink(data.kkLink === undefined ? "" : data.kkLink);
                        setSoundonLink(data.soundonLink === undefined ? "" : data.soundonLink);
                    }
                }
            );
    }


    if (name === "" || avatar === "" || podcasterAvatar === 0 || podcasterName === 0) {
        return (<CircularProgress style={{ marginTop: "25%" }} />);
    } else {
        return (
            <Container className={classes.root} maxWidth="xs">
                <Helmet>
                    <title>{name}</title>
                </Helmet>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={12}>
                        <CardContent>
                            <Avatar variant="rounded" alt={name} src={avatar === "" ? "." : avatar} className={classes.large} />
                            <Typography style={{ paddingTop: "16px" }} variant="h5">{name}</Typography>
                            <ListItem style={{ width: "fit-content", marginLeft: "auto", marginRight: "auto" }}>
                                <ListItemAvatar>
                                    <Avatar style={{ backgroundColor: "#FD3E49" }} variant="circle" alt={podcasterName} src={podcasterAvatar === "" ? "." : podcasterAvatar} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={podcasterName}
                                />
                            </ListItem>
                        </CardContent>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Button fullWidth className={classes.onlymycastColor} variant="outlined" href={omcLink} target='_blank' size='large'>
                            <img alt="onlymycast" src={omclogo} width="24px"/>Onlymycast
                        </Button>
                        {facebookLink.length > 0 ?
                        <Button fullWidth className={classes.facebookButton} variant="outlined" href={facebookLink} target='_blank' size='large'>
                            <FacebookIcon fontSize='large' /> Facebook
                        </Button>
                        : ""}
                        {instagramLink.length > 0 ?
                            <Button fullWidth className={classes.instagramButton} variant="outlined" href={instagramLink} target='_blank' size='large'>
                                <InstagramIcon fontSize='large' /> Instagram
                            </Button>
                            : ""}
                        {youtubeLink.length > 0 ?
                            <Button fullWidth className={classes.youtubeButton} variant="outlined" href={youtubeLink} target='_blank' size='large'>
                                <YouTubeIcon fontSize='large' /> Youtube
                            </Button>
                            : ""}
                        {twitterLink.length > 0 ?
                            <Button fullWidth className={classes.twitterButton} variant="outlined" href={twitterLink} target='_blank' size='large'>
                                <TwitterIcon fontSize='large' /> Twitter
                            </Button>
                            : ""}
                        {applepodcastLink.length > 0 ?
                            <Button fullWidth className={classes.appleColor} variant="outlined" href={applepodcastLink} target='_blank' size='large'>
                                <img alt="apple" src={applelogo} width="30px"></img> apple podcast
                            </Button>
                            : ""}
                        {googlepodcastLink.length > 0 ?
                            <Button fullWidth className={classes.googleColor} variant="outlined" href={googlepodcastLink} target='_blank' size='large'>
                                <img alt="google" src={googlelogo} width="30px"></img>Google Podcast
                            </Button>
                            : ""}
                        {spotifyLink.length > 0 ?
                            <Button fullWidth className={classes.spotifyColor} variant="outlined" href={spotifyLink} target='_blank' size='large'>
                                <img alt="spotify" src={spotiflogo} width="30px"></img> Spotify
                            </Button>
                            : ""}
                        {kkLink.length > 0 ?
                            <Button fullWidth className={classes.kkColor} variant="outlined" href={kkLink} target='_blank' size='large'>
                                <img alt="spotify" src={kklogo} width="30px"></img> KKBOX
                            </Button>
                            : ""}
                        {soundonLink.length > 0 ?
                            <Button fullWidth href={soundonLink} variant="outlined" target='_blank' size='large'>
                                <img alt="soundon" src={soundonlogo} width="30px"></img> Soundon
                            </Button>
                            : ""}
                    </Grid>
                </Grid>
                <Typography style={ { lineHeight : "100px" } } variant="subtitle2" component="span" color="textSecondary">
                    本頁面由 &nbsp;
                    <Link href={props.baseWwwUrl} target="_blank">Onlymycast</Link>
                    &nbsp;用 <span style={ {fontSize: "24px", color: "#FD3E49", fontWeight: "bold"} }>❤</span> 產生！
                </Typography>
            </Container>
        );
    }
}
export default Onelink;
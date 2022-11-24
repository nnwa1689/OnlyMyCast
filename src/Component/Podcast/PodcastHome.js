//react
import React, { useState, useEffect, useRef } from 'react';
import { Link as RLink } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
//ui
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import CircularProgress from '@material-ui/core/CircularProgress';
import PeopleIcon from '@material-ui/icons/People';
import PodcastspList from './PodcastspList';
import List from '@material-ui/core/List';
import { ListItem } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import SwipeableViews from 'react-swipeable-views';
import FacebookIcon from '@material-ui/icons/Facebook';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import InstagramIcon from '@material-ui/icons/Instagram';
import YouTubeIcon from '@material-ui/icons/YouTube';
import TwitterIcon from '@material-ui/icons/Twitter';
//customUI
import TabPanel from '../CustomComponent/TabPanel';
//firebase
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/database";
//other
import { Helmet } from 'react-helmet';
//Ad
import AdsenseChannelComponent from '../Adsense/AdsenseChannelComponent';
//media images
import kklogo from '../../static/kkbox_app_icon.png';
import spotiflogo from '../../static/spotify.png';
import applelogo from '../../static/hero_icon__c135x5gz14mu_large_2x.png';
import googlelogo from '../../static/icons8-google-podcasts-48.png';
import soundonlogo from '../../static/soundon.png';


const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: 275,
        marginTop: 100,
        borderRadius: "10px",
        alignItems: "center",
        textAlign: "center"
    },
    appBar: {
        top: 'auto',
        bottom: 0,
        alignItems: "center"
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
        margin: theme.spacing(1),
    },
    instagramButton: {
        borderColor: "#C13584",
        color: "#C13584",
        margin: theme.spacing(1),
    },
    youtubeButton: {
        borderColor: "#FF0000",
        color: "#FF0000",
        margin: theme.spacing(1),
    },
    twitterButton: {
        borderColor: "#1DA1F2",
        color: "#1DA1F2",
        margin: theme.spacing(1),
    },
    appleColor: {
        color: "#872EC4",
        margin: theme.spacing(1),
    },
    googleColor: {
        color: "#1565C0",
        margin: theme.spacing(1),
    },
    spotifyColor: {
        color: "#1DB954",
        margin: theme.spacing(1),
    },
    kkColor: {
        color: "#09CEF6",
        margin: theme.spacing(1),
    },
    tabBar: {
        boxShadow : "none",
    },
}));


const PodcastHome = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("");
    const [intro, setIntro] = useState("");
    const [subStatu, setSubStatu] = useState(0);
    const [podcasterName, setPodcasterName] = useState(0);
    const [podcasterAvatar, setPodcasterAvatar] = useState(0);
    //0:init 1:sub 2:unsub 3:req
    const isFirstLoad = useRef(true);
    const [subCount, setSubCount] = useState(0);
    const [spList, setSpList] = useState(0);
    const [publicStatu, setPublicStatu] = useState(false);
    const [facebookLink, setFacebookLink] = useState("");
    const [youtubeLink, setYoutubeLink] = useState("");
    const [instagramLink, setInstagramLink] = useState("");
    const [twitterLink, setTwitterLink] = useState("");
    const [applepodcastLink, setApplepodcastLink] = useState();
    const [googlepodcastLink, setGooglepodcastLink] = useState();
    const [spotifyLink, setSpotifyLink] = useState();
    const [kkLink, setKkLink] = useState();
    const [soundonLink, setSoundonLink] = useState();

    const [tabValue, setTabValue] = useState(0);


    useEffect(
        () => {
            //get 此頻道資料  是否被目前使用者訂閱
            if (isFirstLoad.current) {
                getChannleData();
                countSub();
                if (props.isAuth) {
                    getSubStatu();
                }
                window.scrollTo(0, 0);
                isFirstLoad.current = false;
            }
        }
    )

    useEffect(
        () => {
            if (subStatu === 1 || publicStatu || props.user.userId === props.match.params.id) {
                getPodcastList();
            } else {
                setSpList(false);
            }
            countSub();
        }, [subStatu, publicStatu]
    )

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
      };

    const handleChangeIndex = (index) => {
        setTabValue(index);
    };

    const getPodcastList = async () => {
        var changeArr = Array();
        await firebase.firestore().collection("podcast").doc(props.match.params.id).collection('podcast').orderBy('updateTime', "desc").get()
            .then(async (e) => {
                if (e.docs.length === 0) {
                    changeArr = "";
                } else {
                    for (var doc of e.docs) {
                        const qd = doc.data();
                        changeArr.push(
                            <PodcastspList
                                key={doc.id}
                                podId={doc.id}
                                podTitle={qd.title}
                                channelName={name}
                                audioUrl={qd.url}
                                podIcon={avatar}
                                podIntro={qd.intro}
                                setPlayer={props.setPlayer}
                                userId={props.match.params.id}
                                updateTime={qd.updateTime}
                                duration={qd.duration}
                                intro={qd.intro}
                            />
                        )
                    }
                }
            }).then(() => { setSpList(changeArr) })
    }

    const countSub = () => {
        firebase.firestore().collection("fans").doc(props.match.params.id).get()
            .then((doc) => {
                const data = doc.data();
                if (data === undefined) {
                    setSubCount(0);
                } else {
                    setSubCount(Object.entries(data).length);
                }
            })
    }

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
                        setIntro(data.intro);
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

                        //檢查節目公不公開
                        if ( data.publicStatu === 'true') { // 公開
                            setPublicStatu(true);
                        }
                    }
                }
            );
    }

    const updateClickDate = () => {
        firebase.firestore().collection("subscribe").doc(props.userUid).set(
            { [props.match.params.id]: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true }
        )
    }

    const getSubStatu = async () => {
        //已經訂閱
        let result = false;
        await firebase.firestore()
            .collection("subscribe")
            .doc(props.userUid)
            .get()
            .then((doc) => {
                const data = (doc.data() === undefined ? "" : doc.data());
                const found = Object.entries(data).find(
                    ([key, value]) => key === props.match.params.id);
                if (found !== undefined) {
                    setSubStatu(1);
                    updateClickDate();
                    result = true;
                } else {
                    firebase.database()
                        .ref('/subreq/' + props.userUid + "/" + props.match.params.id)
                        .once("value", e => {/*pass*/ })
                        .then((e) => {
                            if (e.val() !== null) {
                                setSubStatu(3)
                            } else {
                                setSubStatu(2);
                            }
                        }
                        );
                }
            });
        return result;
    }

    const handleUnsub = (e) => {
        firebase.firestore().collection("subscribe").doc(props.userUid).update(
            { [props.match.params.id]: firebase.firestore.FieldValue.delete() }
        ).then(
            firebase.firestore().collection("fans").doc(props.match.params.id).update(
                { [props.userUid]: firebase.firestore.FieldValue.delete() }
            ).then(
                () => { setSubStatu(2); }
            )
        )
    }

    const handleSub = (e) => {
        if ( publicStatu ) {
            firebase.firestore().collection("subscribe").doc(props.userUid).set(
                {[props.match.params.id] : firebase.firestore.FieldValue.serverTimestamp()},{ merge: true }
            ).then(
                firebase.firestore().collection("fans").doc(props.match.params.id).set(
                    {[props.userUid] : props.userUid},{ merge: true }
                ).then(()=>{
                    setSubStatu(1);
                }
            ));
        } else {
            firebase.database().ref('/subreq/' + props.userUid).update(
                {
                    [props.match.params.id]: props.match.params.id
                }
            ).then((e) => {
                firebase.database().ref('/subcheck/' + props.match.params.id).update(
                    {
                        [props.userUid]: props.userUid
                    }
                ).then((e) => {
                    setSubStatu(3);
                })
            }).catch();
        }
    }

    const handleRemoveReq = (e) => {
        firebase.database()
            .ref('/subreq/' + props.userUid + "/" + props.match.params.id)
            .remove()
            .then((e) => {
                firebase.database()
                    .ref('/subcheck/' + props.match.params.id + "/" + props.userUid)
                    .remove()
                    .then((e) => {
                        //setSubStatu(2);
                        // 再次確認訂閱狀態
                        getSubStatu();
                    })
            }).catch();
    }

    if (name === "" || avatar === "" || spList === 0 || podcasterAvatar === 0 || podcasterName === 0) {
        return (<CircularProgress style={{ marginTop: "25%" }} />);
    } else {
        return (
            <Container className={classes.root} maxWidth="lg">
                <Helmet>
                    <title>{name} - Onlymycast</title>
                </Helmet>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
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
                            <Typography variant="subtitle1" component="p"><PeopleIcon fontSize='small' />&nbsp;{subCount} 位聽眾</Typography>
                            <br />
                            {props.user.userId === props.match.params.id ?
                                <Button fullWidth variant="outlined" size="large" component={RLink} to="/podcastaccount">編輯電台資訊</Button>
                                :
                                <>
                                    {
                                        (subStatu === 1) &&
                                        <Button fullWidth onClick={(e) => handleUnsub(e)} variant="outlined" size="large" startIcon={<StarBorderIcon />}>
                                            取消追蹤
                                        </Button>
                                    }

                                    {
                                        (subStatu === 2 && !publicStatu) &&
                                        <Button fullWidth onClick={(e) => handleSub(e)} variant="outlined" color="primary" size="large" startIcon={<StarIcon />}>
                                            要求追蹤
                                        </Button>
                                    }

                                    {
                                        (subStatu === 2 && publicStatu) &&
                                        <Button fullWidth onClick={(e) => handleSub(e)} variant="outlined" color="primary" size="large" startIcon={<StarIcon />}>
                                            追蹤
                                        </Button>
                                    }

                                    {
                                        subStatu === 3 &&
                                        <Button fullWidth variant="outlined" size="large" onClick={(e) => handleRemoveReq(e)}>已送出請求</Button>
                                    }
                                </>
                            }
                            <br/>
                            <AdsenseChannelComponent />
                        </CardContent>
                    </Grid>
                    <Grid item xs={12} md={8}>
                    <AppBar className={classes.tabBar} position="static" color="default">
                            <Tabs
                            value={tabValue}
                            onChange={handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="fullWidth" >
                                <Tab label="單集列表" />
                                <Tab label="節目介紹與收聽平台" />
                            </Tabs>
                        </AppBar>
                            <CardContent>
                            <SwipeableViews
                                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                                index={tabValue}
                                onChangeIndex={handleChangeIndex}>
                                <TabPanel value={tabValue} index={0}>
                                {subStatu === 1|| publicStatu || props.user.userId === props.match.params.id ?
                                    spList === "" ?
                                        <Typography variant="h4" component="span"><br />¯\_(ツ)_/¯<br />還沒有任何節目<br />稍後再回來吧</Typography>
                                        :
                                        <List>
                                            {spList}
                                        </List>
                                    :
                                    <Typography variant="h4" component="span"><br />(＞^ω^＜)<br /><br />訂閱後即可收聽</Typography>
                                }
                                </TabPanel>
                                <TabPanel value={tabValue} index={1}>
                                    <h3 style={{ textAlign: "left" }} variant="h6" component="h6">
                                        節目介紹
                                    </h3>
                                    <Typography style={{ textAlign: "left" }} variant="body1" component="p">
                                        <ReactMarkdown>{intro}</ReactMarkdown>
                                    </Typography>
                                    <Divider/>                                   
                                    <h3 style={{ textAlign: "left" }} variant="h6" component="h6">
                                        連結與其他平台
                                    </h3>
                                    <br/>
                                    {facebookLink.length > 0 ?
                                    <IconButton className={classes.facebookButton} href={facebookLink} target='_blank' size='large'>
                                        <FacebookIcon fontSize='large' />
                                    </IconButton>
                                    : ""}
                                    {instagramLink.length > 0 ?
                                        <IconButton className={classes.instagramButton} href={instagramLink} target='_blank' size='large'>
                                            <InstagramIcon fontSize='large' />
                                        </IconButton>
                                        : ""}
                                    {youtubeLink.length > 0 ?
                                        <IconButton className={classes.youtubeButton} href={youtubeLink} target='_blank' size='large'>
                                            <YouTubeIcon fontSize='large' />
                                        </IconButton>
                                        : ""}
                                    {twitterLink.length > 0 ?
                                        <IconButton className={classes.twitterButton} href={twitterLink} target='_blank' size='large'>
                                            <TwitterIcon fontSize='large' />
                                        </IconButton>
                                        : ""}
                                    {applepodcastLink.length > 0 ?
                                        <IconButton className={classes.twitterButton} href={applepodcastLink} target='_blank' size='large'>
                                            <img alt="apple" src={applelogo} width="30px"></img>
                                        </IconButton>
                                        : ""}
                                    {googlepodcastLink.length > 0 ?
                                        <IconButton className={classes.twitterButton} href={googlepodcastLink} target='_blank' size='large'>
                                            <img alt="google" src={googlelogo} width="30px"></img>
                                        </IconButton>
                                        : ""}
                                    {spotifyLink.length > 0 ?
                                        <IconButton className={classes.spotifyColor} href={spotifyLink} target='_blank' size='large'>
                                            <img alt="spotify" src={spotiflogo} width="30px"></img>
                                        </IconButton>
                                        : ""}
                                    {kkLink.length > 0 ?
                                        <IconButton className={classes.kkColor} href={kkLink} target='_blank' size='large'>
                                            <img alt="spotify" src={kklogo} width="30px"></img>
                                        </IconButton>
                                        : ""}
                                    {soundonLink.length > 0 ?
                                        <IconButton href={soundonLink} target='_blank' size='large'>
                                            <img alt="soundon" src={soundonlogo} width="30px"></img>
                                        </IconButton>
                                        : ""}
                                </TabPanel>
                                </SwipeableViews>
                            </CardContent>
                    </Grid>
                </Grid>
            </Container>
        );
    }
}
export default PodcastHome;
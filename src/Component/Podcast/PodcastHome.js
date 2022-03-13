//react
import React, { useState, useEffect, useRef } from 'react'
import { Link as RLink } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
//ui
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import CircularProgress from '@material-ui/core/CircularProgress';
import PeopleIcon from '@material-ui/icons/People';
import PodcastspList from './PodcastspList';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import FacebookIcon from '@material-ui/icons/Facebook';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import InstagramIcon from '@material-ui/icons/Instagram';
import YouTubeIcon from '@material-ui/icons/YouTube';
import TwitterIcon from '@material-ui/icons/Twitter';
//firebase
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/database";
//other
import { Helmet } from 'react-helmet';
import { ListItem } from '@material-ui/core';


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
        marginBottom: theme.spacing(3),
        marginTop: theme.spacing(3),
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
        color: "#872EC4"
    },
    googleColor: {
        color: "#1565C0"
    }
}));


const PodcastHome = (props) => {
    const classes = useStyles();
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
            <Container maxWidth="md">
                <Helmet>
                    <title>{name} - Onlymycast</title>
                </Helmet>
                <Card className={classes.root}>
                    <CardContent>
                        <Grid container justify='center' direction="row" spacing={0}>
                            <Grid item xs={12} sm={4} md={3}>
                                <Avatar variant="rounded" alt={name} src={avatar === "" ? "." : avatar} className={classes.large} />
                            </Grid>
                            <Grid item xs={12} sm={7} md={8}>
                                <Typography style={{ paddingTop: "16px" }} variant="h5">{name}</Typography>
                                <ListItem style={{ width: "fit-content", marginLeft: "auto", marginRight: "auto" }}>
                                    <ListItemAvatar>
                                        <Avatar style={{ backgroundColor: "#FD3E49" }} variant="circle" alt={podcasterName} src={podcasterAvatar === "" ? "." : podcasterAvatar} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={podcasterName}
                                    />
                                </ListItem>
                                <Typography variant="subtitle1" component="span"><PeopleIcon fontSize='small' />&nbsp;{subCount} 位聽眾</Typography>
                                <br />
                                {facebookLink.length > 0 ?
                                    <IconButton className={classes.facebookButton} href={facebookLink} target='_blank' size='small'>
                                        <FacebookIcon fontSize='large' />
                                    </IconButton>
                                    : ""}
                                {instagramLink.length > 0 ?
                                    <IconButton className={classes.instagramButton} href={instagramLink} target='_blank' size='small'>
                                        <InstagramIcon fontSize='large' />
                                    </IconButton>
                                    : ""}
                                {youtubeLink.length > 0 ?
                                    <IconButton className={classes.youtubeButton} href={youtubeLink} target='_blank' size='small'>
                                        <YouTubeIcon fontSize='large' />
                                    </IconButton>
                                    : ""}
                                {twitterLink.length > 0 ?
                                    <IconButton className={classes.twitterButton} href={twitterLink} target='_blank' size='small'>
                                        <TwitterIcon fontSize='large' />
                                    </IconButton>
                                    : ""}
                                {applepodcastLink.length > 0 ?
                                    <IconButton className={classes.twitterButton} href={applepodcastLink} target='_blank' size='small'>
                                        <img alt="apple" src="../hero_icon__c135x5gz14mu_large_2x.png" width="30px"></img>
                                    </IconButton>
                                    : ""}
                                {googlepodcastLink.length > 0 ?
                                    <IconButton className={classes.twitterButton} href={googlepodcastLink} target='_blank' size='small'>
                                        <img alt="google" src="../icons8-google-podcasts-48.png" width="30px"></img>
                                    </IconButton>
                                    : ""}
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
                            </Grid>
                        </Grid>
                        <br />
                        <Divider />
                        <br />
                        <Typography style={{ textAlign: "left" }} variant="body1" component="span">
                            <ReactMarkdown>{intro}</ReactMarkdown>
                        </Typography>
                        <Divider />
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
                    </CardContent>
                </Card>
            </Container>
        );
    }
}
export default PodcastHome;
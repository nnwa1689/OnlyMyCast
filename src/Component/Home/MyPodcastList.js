//react
import React, { useState, useEffect } from 'react'
import { Link as RLink } from 'react-router-dom';
//ui
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import Badge from '@material-ui/core/Badge';
import { Row, Item } from '@mui-treasury/components/flex';
import { Info, InfoTitle, InfoSubtitle } from '@mui-treasury/components/info';
import { useTutorInfoStyles } from '@mui-treasury/styles/info/tutor';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme)=>({
    root: {
      minWidth: 275,
      marginTop: 100,
      marginBottom: 0,
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
        marginRight: theme.spacing(2),
        color: "#FFFFFF",
        backgroundColor: "#FD3E49",
      },
    media: {
        borderRadius: 6,
      },
    card: {
        maxWidth: 343,
        margin: 'auto',
        borderRadius: 10,
        padding: 12,
    },
    action: {
      backgroundColor: '#fff',
      boxShadow: '0 1px 4px 0 rgba(0,0,0,0.12)',
      '&:hover': {
        backgroundColor: '#fff',
        color: '#000',
      },
    }
  })
  );


  const MyPodcastList = (props) => {

    const classes = useStyles();
    const [haveNewEP, setHaveNewEP] = useState(false);
    const [intro, setIntro] = useState(props.podcastIntro.length>=40 ? props.podcastIntro.substring(0, 40) + "⋯" : props.podcastIntro);
    const [podcastName, setPodcastName] = useState(props.podcastName.length>=20 ? props.podcastName.substring(0, 20) + "......" : props.podcastName);
    
    const toDataTime = (sec)=>{
      var t = new Date(Date.UTC(1970, 0, 1, 0, 0, 0))
      t.setUTCSeconds(sec);
      return t.getFullYear() + '/' + (t.getMonth()+ 1) + '/' + t.getDate()
      //return t.toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'},);
    }

    useEffect(
      ()=>{
        if (props.haveNewEP!==false && props.haveNewEP!==undefined) {
          setHaveNewEP(true);
        }
      }
    )
    return (
    <Grid item xs={12} sm={6}>
    <Row p={2} gap={2} bgcolor={'#FFFFFF'} borderRadius={10}>
      <Item button component={RLink} to={"/podcast/" + props.podcastId}>
      {haveNewEP ? 
        <Badge
        color="primary"
        badgeContent={"新單集"}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}>
            <Avatar variant="rounded" className={classes.large} alt={props.podcastName} src={props.podcastCover==="" ? "." : props.podcastCover} />
        </Badge>
      :
        <Avatar variant="rounded" className={classes.large} alt={props.podcastName} src={props.podcastCover} />
    }
      </Item>
      <Info useStyles={useTutorInfoStyles}>
        <InfoTitle><Link component={RLink} to={"/podcast/" + props.podcastId} variant="body1" underline="none">{podcastName}</Link> </InfoTitle>
        <InfoSubtitle style={ {fontFamily : 'NotoSansTC-Regular'} }>{ intro }</InfoSubtitle>
        <InfoSubtitle style={ {fontFamily : 'NotoSansTC-Regular'} }>最後更新：{ toDataTime(props.updateTime) }</InfoSubtitle>
      </Info>
    </Row>
    </Grid>
    )
}
export default MyPodcastList;
import React, { useRef, useEffect } from 'react'
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme)=>({
    root: {
        minWidth: 275,
        marginTop: 50,
        alignItems:"center",
        textAlign:"center"
    },
  }));

const AdsenseChannelComponent = () => {

    const isFirstLoad = useRef(true);
    const classes = useStyles();
    useEffect(
        ()=>{
            if (isFirstLoad.current===true) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                isFirstLoad.current = false;
            }
        }
    )

    return(
        <Container maxWidth="lg" className={classes.root}>
            <ins class="adsbygoogle"
            style={ { display: "block" }}
            data-ad-client="ca-pub-3826338280068687"
            data-ad-slot="1963396975"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
        </Container>
    )
}
export default AdsenseChannelComponent;
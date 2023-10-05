//react
import React from 'react';

//ui
import Divider from '@material-ui/core/Divider';
import { Container } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles((theme)=>({
    root: {
        marginTop: 50,
        marginBottom: 150,
        alignItems:"center",
        textAlign:"center"
    },
  }));

const Footer = ()=> {
    const classes = useStyles();
    return(
        <Container maxWidth="lg" className={classes.root}>
            <Divider/><br/>
                &nbsp;&nbsp;
                <Link target="_blank" href="https://onlymycast.com/page/privacypolicy" variant="subtitle2">隱私與條款</Link>
                &nbsp;&nbsp;
                <Link target="_blank" href="https://onlymycast.com/category/45" variant="subtitle2">改版日記</Link>
                &nbsp;&nbsp;
                <Link target="_blank" href="https://studio-44s.tw/contact" variant="subtitle2">聯絡我們</Link>
                &nbsp;&nbsp;
                <Link target="_blank" href="https://onlymycast.com/page/about" variant="subtitle2">關於我們</Link>
                &nbsp;&nbsp;
                <Link target="_blank" href="https://onlymycast.com/blog" variant="subtitle2">部落格</Link>
        </Container>
    );
}

export default Footer;
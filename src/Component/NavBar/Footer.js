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
                <Link target="_blank" href="https://n-d.tw/page/privacypolicy" variant="subtitle2">隱私與條款</Link>
                &nbsp;
                &nbsp;
                <Link target="_blank" href="https://discovered-plantain-cb9.notion.site/OnlyMyCast-57f05f98fbe44254a2f57ca0a07c8203" variant="subtitle2">改版日記</Link>
                &nbsp;
                <Link target="_blank" href="https://n-d.tw/page/contact" variant="subtitle2">聊天去</Link>
                <Typography variant="subtitle2" component="p">Copyright©LabHazuya</Typography>
        </Container>
    );
}

export default Footer;
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
                <Link target="_blank" href="https://www.notes-hz.com/page/privacypolicy" variant="subtitle2">隱私權</Link>
                &nbsp;
                <Link target="_blank" href="https://www.notes-hz.com/page/serviceRules" variant="subtitle2">條款</Link>
                &nbsp;
                <Link target="_blank" href="https://discovered-plantain-cb9.notion.site/OnlyMyCast-57f05f98fbe44254a2f57ca0a07c8203" variant="body2">改版日誌</Link>
                &nbsp;
                <Link target="_blank" href="https://www.notes-hz.com/page/readerService" variant="subtitle2">聯繫</Link>
                <Typography variant="subtitle2" component="p">Copyright©LabHazuya</Typography>
        </Container>
    );
}

export default Footer;
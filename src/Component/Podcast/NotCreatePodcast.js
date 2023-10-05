//react
import React, { useState, useRef, useEffect } from 'react'
import { Link as RLink } from 'react-router-dom';
//ui
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme)=>({
    root: {
        minWidth: 275,
        marginTop: 100,
        borderRadius: "10px",
        alignItems:"center",
        textAlign:"center"
    },}));

const NotCreatePodcast = () => {
    const classes = useStyles();
    return(
        <Container maxWidth="lg" className={classes.root}>
            <CardContent>
                <Typography variant="h2" component="h1" gutterBottom>
                    (^ｰ^)ノ<br/>
                </Typography>
                <Typography variant="h5" component="span">
                    嗨<br/>你還沒有建立電台 ╮(╯▽╰)╭<br/>                            
                </Typography>
                <br/>
                <Button
                    component={RLink}
                    to="/podcastaccount"
                    color="primary"
                    fullWidth
                    size="large"
                    variant="contained"
                    >              
                    立即建立屬於我的私人電台
                    </Button>
            </CardContent>
        </Container>
    );
}

export default NotCreatePodcast;
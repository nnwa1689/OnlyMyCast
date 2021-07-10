//react
import React, { useState, useEffect, useRef } from 'react';
import { Link as RLink, useHistory } from 'react-router-dom';
//ui
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { OutlinedInput } from '@material-ui/core';
import { InputLabel } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import { deepOrange } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
//component
import PodcastList from '../Home/PodcastList';
//firebase
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";


const useStyles = makeStyles((theme)=>({
    root: {
        minWidth: 275,
        marginTop: 100,
        marginBottom: 150,
        alignItems:"center",
        textAlign:"center"
    },
    appBar: {
      top: 'auto',
      bottom: 0,
      alignItems:"center"
    },
    large: {
      width: theme.spacing(20),
      height: theme.spacing(20),
      marginBottom: theme.spacing(3),
      marginTop:theme.spacing(3),
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
      marginLeft:"auto",
      marginRight:"auto"
    },
    orange: {
        color: theme.palette.getContrastText(deepOrange[500]),
        backgroundColor: deepOrange[500],
      },
    menuButton: {
      margin: theme.spacing(1),
    },
    margin: {
        marginBottom: theme.spacing(2),
        marginTop:theme.spacing(2)
      },
  }));

const Search = (props) => {
    const classes = useStyles();
    const history = useHistory();
    const [searchResult, setSearchResult] = useState("");
    const isFirstLoad = useRef(true);
    const [query, setQuery] = useState((props.match.params.q===undefined ? "" : props.match.params.q));

    useEffect(
        ()=>{
            if (isFirstLoad.current) {
                handleSearch();
                isFirstLoad.current=false;
            }
        }
    )

    const handleSearch = () =>{
        history.push('/search/' + query);
        setSearchResult("");
        if (query !== "") {
            firebase.firestore().collection("channel").where(
                firebase.firestore.FieldPath.documentId(), "==", query).get()
            .then((querySnapshot)=>{ 
                querySnapshot.forEach(
                    (doc)=>{
                        setSearchResult(
                            <PodcastList podcastName={doc.data().name} podcastIntro={doc.data().intro} podcastCover={doc.data().icon} podcastId={query}></PodcastList>);
                    }
                )

           })
        }
    }

    return(
        <Container maxWidth="sm">
            <Card className={classes.root}>
                <CardContent>
                <Typography variant="h5" component="h1">搜尋</Typography>
                <Typography variant="body1" component="span">搜尋您朋友的電台，並追蹤他</Typography>
                <FormControl fullWidth className={classes.margin} variant="outlined">
                <InputLabel htmlFor="queryInput">Search</InputLabel>
                    <OutlinedInput id="queryInput" value={query} defaultValue={props.q} onChange={(e)=>setQuery(e.target.value)} label="Search" endAdornment={
                        <InputAdornment position="end">
                            <IconButton onClick={handleSearch} aria-label="search" className={classes.margin}>
                                <SearchIcon fontSize="large" />
                            </IconButton>
                        </InputAdornment>
                    } />
                </FormControl>
                    <br/><br/>
                {searchResult!=="" && searchResult}
                </CardContent>
            </Card>
        </Container>
    );

}
export default Search;
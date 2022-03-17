//react
import React, { useEffect, useRef } from 'react';
import { Link as RLink } from 'react-router-dom';
//ui
import HomeIcon from '@material-ui/icons/Home';
import Typography from '@material-ui/core/Typography';
import { Container } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import ErrorIcon from '@material-ui/icons/Error';
//other
import { Helmet } from 'react-helmet';

const NotFound = (props) => {

    const isFirstLoad = useRef(true);
    
    useEffect(
      ()=>{
        if (isFirstLoad.current && props.user!=="") {
          window.scrollTo(0, 0);
          isFirstLoad.current=false;
        }
      }
    )

  return (
    <Container maxWidth="lg" style={ { marginTop: 100, } }>
      <Helmet>
          <title>Onlymycast</title>
      </Helmet>
      <ErrorIcon style={{ fontSize: 64 }}/>
      <Typography variant="h4" component="h1"><br/>沒有發現這個頁面<br/></Typography>
      <br/>
      <Divider/>
      <br/>
      <Typography variant="h6">歐歐，好像找不到你要去的地方！查明後再來吧～</Typography>
      <br/>
      <Button component={RLink} to="/" variant="contained" color="primary" size='large'>
        <HomeIcon/>帶我回到首頁
      </Button>
    </Container>
  )
}
export default NotFound;
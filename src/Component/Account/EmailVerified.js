/*react*/
import React, { useState, useEffect } from 'react';
import { Link as RLink, useHistory } from 'react-router-dom';
/*Firebase*/
import firebase from "firebase/app";
import "firebase/auth";
/*Google themes*/
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import LogoIcon from '../../static/only-my-cast-pink.svg';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import LinearProgress from '@material-ui/core/LinearProgress';


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      <Link href="https://studio-44s.tw/">
        <span style={ {fontSize: "24px", color: "#FD3E49", fontWeight: "bold"} }>❤</span> 四拾四秒網頁製作所©
      </Link><br/><br/>
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: "10px",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


const EmailVerified = () => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [handleCode, setHandleCode] = useState("init");
  const history = useHistory();

  const sendEmailVerification = async() => {
    setHandleCode("loading");
    await firebase.auth().currentUser.sendEmailVerification()
    .then(() => {
      // Email verification sent!
      setHandleCode("send");
    });
  }


  useEffect(
    ()=>{
        firebase.auth().onAuthStateChanged((user)=> {
            if(!user) {
              //沒有登入的話引導去登入畫面
              history.push('/signin');
            } else if (user.emailVerified) {
              // 如果已經驗證過就讓畫面做其他渲染
              setHandleCode("verified");
            } else {
              setEmail(user.email);
            }
          });
    }
  )

  return (
    handleCode === "verified" ? (window.location.href = "./")
    :
    <Container component="main" maxWidth="xs">
        <CardContent className={classes.paper}>
        { handleCode==="loading" && <LinearProgress style={{ wdith: 100, marginBottom: 10}}/>}
          <img src={LogoIcon} width="200"></img>
          <h4 component="span" variant="body1">驗證您的信箱之後，才能開始使用網站功能</h4>
          <form className={classes.form} noValidate>
            <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                className={classes.submit}
                onClick={sendEmailVerification}
                disabled={handleCode==="loading" || handleCode === "send"}
            >
                { handleCode === "send" ? "已發送驗證信至" + email : "發送驗證Email至" + email }
            </Button>
          </form>
        </CardContent>
    <Box mt={8}>
      <Copyright />
    </Box>
  </Container>
  );
}
export default EmailVerified;
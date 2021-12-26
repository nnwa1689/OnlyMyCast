/*react*/
import React, { useState, useEffect } from 'react';
import { Link as RLink, useHistory } from 'react-router-dom';
/*Firebase*/
import firebase from "firebase/app";
import "firebase/auth";
/*Google themes*/
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import LogoIcon from '../../static/only-my-cast-icon-pink.svg'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import LinearProgress from '@material-ui/core/LinearProgress';


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © ' + new Date().getFullYear()}<br/>
      <Link href="https://lab.notes-hz.com/">
        <span style={ {fontSize: "24px", color: "#028ff3", fontWeight: "bold"} }>Lab</span>
        <span style={ {fontSize: "24px", color: "#FD3E49", fontWeight: "bold"} }>H</span>
        <span style={ {fontSize: "24px", color: "#FF8738", fontWeight: "bold"} }>a</span>
        <span style={ {fontSize: "24px", color: "#FFA900", fontWeight: "bold"} }>z</span>
        <span style={ {fontSize: "24px", color: "#00A752", fontWeight: "bold"} }>u</span>
        <span style={ {fontSize: "24px", color: "#007BEE", fontWeight: "bold"} }>y</span>
        <span style={ {fontSize: "24px", color: "#9B49DF", fontWeight: "bold"} }>a</span>
        </Link><br/>
        <Link href="https://www.notes-hz.com/">筆記長也NotesHazuya</Link>
        <br/><br/>
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
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


const SignIn = () => {
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
              // 使用者已登入，redirect to Homepage
              history.push('/signin');
            } else if (user.emailVerified) {
              history.push('/');
            } else {
              setEmail(user.email);
            }
          });
    }
  )

  return (
    <Container component="main" maxWidth="xs">
      <Card className={classes.paper}>
          <CardContent>
          { handleCode==="loading" && <LinearProgress style={{ wdith: 100, marginBottom: 10}}/>}
            <img src={LogoIcon} width="128"></img>
            <Typography component="h1" variant="h5">信箱驗證</Typography>
            <br/>
            <Typography component="span" variant="body1">驗證您的信箱之後，才能開始使用網站功能</Typography>
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
      </Card>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
export default SignIn;
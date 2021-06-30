import React, { useState, useEffect } from 'react';
import { Link as RLink, useHistory } from 'react-router-dom';
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
import LogoIcon from '../../static/only-my-cast-icon.svg'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import LinearProgress from '@material-ui/core/LinearProgress';


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
  const [password, setPassword] = useState("");
  const [emailErr, setEmailErr] = useState(false);
  const [pwErr, setPwErr] = useState(false);
  const [handleCode, setHandleCode] = useState("init");
  const history = useHistory();

  const handleSignin = ()=>{
    setHandleCode("loading")
    setEmailErr(false);
    setPwErr(false);

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
    })
    .catch((error) => {
      if(error.code==="auth/invalid-email")
        setEmailErr("Email格式錯誤")
      if(error.code==="auth/wrong-password")
        setPwErr("密碼錯誤")
      if(error.code==="auth/user-not-found")
        setEmailErr("使用者不存在")
      setHandleCode("error");
    });
  }

  useEffect(
    ()=>{
        firebase.auth().onAuthStateChanged((user)=> {
            if(user) {
              // 使用者已登入，redirect to Homepage
              history.push('/')
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
            <Typography component="h1" variant="h5">立即登入，建立或收聽私人Podcast！</Typography>
            <form className={classes.form} noValidate>
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e)=>{setEmail(e.target.value)}}
                error={emailErr !== false}
                helperText={ emailErr !== false && (emailErr) }
                disabled={handleCode==="loading"}
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="密碼"
                label="密碼"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e)=>{setPassword(e.target.value)}}
                error={pwErr !== false}
                helperText={ pwErr !== false && (pwErr) }
                disabled={handleCode==="loading"}
            />
            <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={handleSignin}
                disabled={handleCode==="loading"}
            >
                登入
            </Button>
            <Link component={RLink} to="/signup" variant="body2">
                    {"沒有帳號？立即註冊"}
                </Link>
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
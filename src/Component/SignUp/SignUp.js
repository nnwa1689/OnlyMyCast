//react
import React, {useState, useEffect} from 'react';
import { Link as RLink, useHistory } from 'react-router-dom';
//firebase
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
/*Google Theme*/
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import LogoIcon from '../../static/only-my-cast-icon-pink.svg'
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
        </Link><br/><br/>
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const SignUp = ()=>{
  const classes = useStyles();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [handleCode, setHandleCode] = useState('init');
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [pwError, setPwError] = useState(false);
  const history = useHistory();

  const handleSignup = ()=>{
    setHandleCode('loading');
    setNameError(false);
    setEmailError(false);
    setPwError(false);
    if (email === "" || name === "" || password === "") {
      if (email === "")
        setEmailError("Email是必填欄位")
      if (name==="")
        setNameError("暱稱是必填欄位")
      if (password==="")
        setPwError("密碼是必填欄位")
      setHandleCode('error');
    } else {
      firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in 
        var user = userCredential.user;
        firebase.firestore().collection("user").doc(user.uid).set(
          {
            name: name,
            userId : "",
            avatar : ""
          }
        ).then(() => {
          history.push('./emailverified');
        })
        .catch((error) => {
            console.log("Error writing document: ");
        });  
      })
      .catch((error) => {
        if(error.code==="auth/invalid-email"){
          setEmailError("Email格式錯誤");
          setHandleCode('invalid-email');
        } else if (error.code==="auth/weak-password"){
          setPwError("密碼要大於6位數")
          setHandleCode('weak-passwor');
        } else if (error.code==="auth/email-already-in-use"){
          setEmailError("此Email已經被註冊過了")
          setHandleCode('email-already-in-use');
        } else {
          setHandleCode('other-error');
        }
      });
    }
  }

  useEffect(
    ()=>{
        firebase.auth().onAuthStateChanged((user)=> {
            if(user) {
              // 使用者已登入，redirect to Homepage
              setHandleCode('login');
            }
          });
    }
  )

  return (

      handleCode === 'login' ? ""
      :
      <Container component="main" maxWidth="xs">
      <Card className={classes.paper}>
          <CardContent>
          { handleCode==="loading" && <LinearProgress style={{ wdith: 100, marginBottom: 10}}/>}
          <img style={{fill: "#FD3E49"}} src={LogoIcon} width="128"></img>
        <Typography component="h1" variant="h5">
          立即註冊<br/>即可建立私人Podcast
        </Typography>
        <div className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="name"
                label="暱稱"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e)=>{setName(e.target.value)}}
                helperText={ nameError!==false && (nameError)}
                error={ nameError !== false }
                disabled={handleCode==="loading"}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e)=>{setEmail(e.target.value)}}
                helperText={ emailError!==false && (emailError)}
                error={ emailError !== false }
                disabled={handleCode==="loading"}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="密碼"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e)=>{setPassword(e.target.value)}}
                helperText={ pwError!==false && (pwError)}
                error={ pwError !== false }
                disabled={handleCode==="loading"}
              />
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSignup}
            disabled={handleCode==="loading"}
          >
            立即註冊
          </Button>
          <Grid container justify="center">
            <Grid item>
              <Typography component="span" variant="body2">
                註冊即同意本網站的
                <Link target="_blank" href="https://www.notes-hz.com/page/serviceRules" variant="body2">服務條款</Link>
                、<Link target="_blank" href="https://www.notes-hz.com/page/privacypolicy" variant="body2">隱私政策</Link>
              </Typography>
            </Grid>
          </Grid>
          <br/>
          <Grid container justify="center">
            <Grid item>
              <Typography component="span" variant="body1">
                <Link href="./signin">
                  已有帳號？立即登入
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </div>
        </CardContent>
      </Card>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default SignUp;
 
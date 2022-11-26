/*react*/
import React, { useState, useEffect } from 'react';
import { Link as RLink, useHistory } from 'react-router-dom';
/*Firebase*/
import firebase from "firebase/app";
import "firebase/auth";
/*SSO*/
import { createUserInfoWithSSO, GoogleSigning,checkUserReg } from '../../Functions/SSO';
/*Google themes*/
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import LogoIcon from '../../static/only-my-cast-pink.svg';
import googleicon from '../../static/googleicon.png';
import CardContent from '@material-ui/core/CardContent';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';


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
      window.location.reload();
    })
    .catch((error) => {
      if(error.code==="auth/invalid-email")
        setEmailErr("Email格式錯誤")
      if(error.code==="auth/wrong-password")
        setPwErr("密碼錯誤")
      if(error.code==="auth/user-not-found")
        setEmailErr("使用者不存在")
      if(error.code==="auth/too-many-requests")
        setEmailErr("密碼錯誤次數過多，請稍候再嘗試或使用忘記密碼")
      setHandleCode("error");
    });
  }

  useEffect(
    ()=>{
        firebase.auth().onAuthStateChanged(async(user)=> {
            if (user) {
              setHandleCode("loading");
              //檢查使用者資料是否被建立（如從google登入）
              if (user.providerData[0].providerId === "google.com") {
                  await checkUserReg(user)
                  .then(
                    async(r) => {
                      if(!r) {
                        //沒有就建立
                        await createUserInfoWithSSO(user)
                        .then(
                          () => {
                            window.location.href = "./";
                          }
                        ).catch((e) => console.log(e))
                      } else {
                        window.location.href = "./";
                      }
                    }
                    )
              } else {
                // 使用者已登入，redirect to Homepage
                window.location.href = "./";
              }
            }
          });
    }
  )

  return (
    <Container component="main" maxWidth="xs">
          <CardContent className={classes.paper}>
          { handleCode==="loading" && <LinearProgress style={{ wdith: 100, marginBottom: 10}}/>}
            <img src={LogoIcon} width="200"></img>
            <h4 component="h1" variant="subtitle2">以 Google 帳號或 Email 帳號繼續</h4>
            <Button
                fullWidth
                variant="outlined"
                color="secondary"
                className={classes.submit}
                onClick={GoogleSigning}
                disabled={handleCode==="loading"}
            >
              <img src={googleicon} width="28" style={ { marginRight: "10px" } }></img> 使用 Google 帳戶登入或註冊
            </Button>
            <div className={classes.form} noValidate>
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
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={handleSignin}
                  disabled={handleCode==="loading"}
              >
                  使用 Email 登入繼續
              </Button>
              <Grid container justify="center">
                <Grid item>
                  <Typography component="span" variant="body2">
                    <Link href="./signup" variant="body2">
                            {"立即註冊"}
                    </Link> &nbsp;&nbsp;
                    <Link component={RLink} to="/forgetpassword" variant="body2">
                            {"忘記密碼"}
                    </Link>
                  </Typography>
                </Grid>
                <Grid item className={classes.submit}>
                  <Typography component="span" variant="body2">
                    註冊並登入即同意本網站的
                    <Link target="_blank" href="https://www.notes-hz.com/page/serviceRules" variant="body2">服務條款</Link>
                    、<Link target="_blank" href="https://www.notes-hz.com/page/privacypolicy" variant="body2">隱私政策</Link>
                  </Typography>
                </Grid>
              </Grid>
            </div>
          </CardContent>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
export default SignIn;
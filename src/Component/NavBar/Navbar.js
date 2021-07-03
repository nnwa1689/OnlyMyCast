import React, { useState, useEffect } from 'react';
import { Link as RLink } from 'react-router-dom';
import firebase from "firebase/app";
import "firebase/auth";
/*google themes */
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Drawer from '@material-ui/core/Drawer';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange } from '@material-ui/core/colors';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PublishIcon from '@material-ui/icons/Publish';
import EditIcon from '@material-ui/icons/Edit';
import Badge from '@material-ui/core/Badge';
import Link from '@material-ui/core/Link';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import GraphicEqIcon from '@material-ui/icons/GraphicEq';
import LogoIcon from '../../static/only-my-cast-icon.svg'
import Logo from '../../static/only-my-cast.svg'

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    margin: 0,
    width: 'auto',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 1),
    // vertical padding + font size from searchIcon
  }, 
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
}));

const NavBar = (props) => {

  console.log(props.user)
    const classes = useStyles();
    const [sideBar, setSideBar] = useState(false);
    const [reqCount, setReqCount] = useState("");
    const handleLogout = ()=>{
      firebase.auth().signOut().then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
    }

    useEffect(
      ()=>{
        getReqCount();
      }
    )

    const getReqCount = ()=>{
      firebase.database().ref('/subcheck/' + props.user.userId).once("value", e => {
      }).then((e)=>{
        if (e.val() !== null) {
          setReqCount(Object.entries(e.val()).length);
        } else {
          setReqCount(0);
        }
      })
    }

    return (
      <div>
          <AppBar position="fixed">
          <Toolbar>
              <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
              onClick={ ()=>{ setSideBar(true) } }>
                  <MenuIcon />
              </IconButton>
              <Link component={RLink} to="/" >
                <img alt="OnlyMyCast" src={Logo} width="140" height="50" />
              </Link>
              <div className={classes.grow}/>
              <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="searching"
                  component={RLink} 
                  to="/search"
                  >
                  <SearchIcon />
                  </IconButton>
          </Toolbar>
          </AppBar>

          <Drawer anchor="left" open={ sideBar } onClose={ ()=> setSideBar(false) }>
              <div className={ classes.list } 
                  role="presentation"
                  onClick={ ()=>{ setSideBar(false) } }
                  onKeyDown={ ()=>{ setSideBar(false) } }>
                  <List>
                      <ListItem key="account">
                          <ListItemIcon><Avatar alt={props.user.name} src={props.user.avatar==="" ? "." : props.user.avatar} className={ classes.orange } /></ListItemIcon>
                          <ListItemText primary={props.user.name}></ListItemText>
                      </ListItem>
                  </List>
                  <Divider />
                  <List>
                      <ListItem button component={RLink} to="/account" key="setting">
                          <ListItemIcon><AccountBoxIcon /></ListItemIcon>
                          <ListItemText primary="帳號設定"></ListItemText>
                      </ListItem>
                      <ListItem button component={RLink} to="/podcastaccount" key="podcastsetting">
                          <ListItemIcon><GraphicEqIcon /></ListItemIcon>
                          <ListItemText primary="電台設定"></ListItemText>
                      </ListItem>
                      <ListItem onClick={handleLogout} button key="logout">
                          <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                          <ListItemText primary="登出"></ListItemText>
                      </ListItem>
                  </List>
                  <Divider />
                  <List>
                      <ListItem button component={RLink} to="/uploadpodcast" key="publish">
                          <ListItemIcon><PublishIcon /></ListItemIcon>
                          <ListItemText primary="上傳單集"></ListItemText>
                      </ListItem>
                      <ListItem button component={RLink} to="/editpodcasts" key="editpod">
                          <ListItemIcon><EditIcon /></ListItemIcon>
                          <ListItemText primary="單集管理"></ListItemText>
                      </ListItem>
                      <ListItem button component={RLink} to="/subreq" key="subreq">
                          <ListItemIcon>
                              <Badge badgeContent={props.reqCount} color="secondary">
                                  <InboxIcon />
                              </Badge>
                          </ListItemIcon>
                          <ListItemText primary="審核訂閱"></ListItemText>
                      </ListItem>
                  </List>
                  <Divider />

                  <List>
                      <ListItem key="privatepolic" fontSize={5}>
                          <Link href="/" variant="body3">隱私權政策</Link>
                          &nbsp;
                          <Link href="/" variant="body3">條款</Link>
                      </ListItem>
                      <ListItem key="copyright">
                          <div fontSize={10}>©2021<br/>OnlyMyCast - 建立自己的私人 PodCast</div>
                      </ListItem>
                  </List>
              </div>
          </Drawer>
      </div>
    );
}
export default NavBar;

//react
import React, { useState, useEffect } from 'react';
import { Link as RLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
//customhook
import useWindowWidth from '../../Hook/useWindowWidth';
import Darkmode from './Darkmode';
//firebase
import firebase from "firebase/app";
import "firebase/auth";
/*google themes */
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import Drawer from '@material-ui/core/Drawer';
import Avatar from '@material-ui/core/Avatar';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PublishIcon from '@material-ui/icons/Publish';
import EditIcon from '@material-ui/icons/Edit';
import Badge from '@material-ui/core/Badge';
import Link from '@material-ui/core/Link';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import GraphicEqIcon from '@material-ui/icons/GraphicEq';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import FaceIcon from '@material-ui/icons/Face';
import HelpIcon from '@material-ui/icons/Help';
import Tooltip from '@material-ui/core/Tooltip';
import InputBase from '@material-ui/core/InputBase';
//static
import LogoIcon from '../../static/only-my-cast-icon.svg';
import Logo from '../../static/only-my-cast.svg';


const useStyles = makeStyles((theme) => ({
    grow: {
      flexGrow: 1,
    },
    appBar: {
       backgroundColor: "rgba(40, 40, 40, 0.8)",
       backdropFilter: "blur(4px)",
       boxShadow: "none",
    },
    menuButton: {
      marginRight: theme.spacing(1),
    },
    search: {
      borderRadius: theme.shape.borderRadius,
      transition: 'background-color .15s',
      backgroundColor: "rgba(200, 200, 200, 0.9)",
      '&:hover': {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
      },
      '&:focus-within': {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
      },
      marginLeft: theme.spacing(3),
      width: '300px',
      padding: "5px",
    },
    searchDark: {
      borderRadius: theme.shape.borderRadius,
      transition: 'background-color .15s',
      backgroundColor: "rgba(55, 55, 55, 0.9)",
      '&:hover': {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
      },
      '&:focus-within': {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
      },
      marginLeft: theme.spacing(3),
      width: '300px',
      padding: "5px",
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
    pink: {
      color: "#FFFFFF",
      backgroundColor: "#FD3E49",
    },
}));

const NavBar = (props) => {

    const classes = useStyles();
    const [sideBar, setSideBar] = useState(false);
    const [reqCount, setReqCount] = useState("");
    const windowWidth = useWindowWidth();
    const [search, setSearch] = useState("");
    const darkmode = useSelector(state => state.mode);
    const handleLogout = ()=>{
      firebase.auth().signOut().then(() => {
        // Sign-out successful.
        localStorage.removeItem('themeMode');
        window.location.reload();
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
      if (props.user.userId !== undefined && props.user.userId !== null && props.user.userId !== "") {
        firebase.database().ref('/subcheck/' + props.user.userId).once("value", e => {
        }).then((e)=>{
          if (e.val() !== null) {
            setReqCount(Object.entries(e.val()).length);
          } else {
            setReqCount(0);
          }
        })
      } else {
        setReqCount(0);
      }
    }

    return (
      <div>
          <AppBar className={classes.appBar} position="fixed">
          <Toolbar>
              <Tooltip title="選單">
                { reqCount > 0 ?
                    <IconButton
                    edge="start"
                    className={classes.menuButton}
                    color="inherit"
                    aria-label="open drawer"
                    onClick={ ()=>{ setSideBar(true) } }>
                    <Badge
                      color="primary" variant="dot"
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}><MenuIcon />
                    </Badge>
                    </IconButton>            
                  
                :
                <IconButton
                  edge="start"
                  className={classes.menuButton}
                  color="inherit"
                  aria-label="open drawer"
                  onClick={ ()=>{ setSideBar(true) } }>
                      <MenuIcon />
                  </IconButton>
                }
              </Tooltip>
              <Link component={RLink} to="/" >
                <img alt="OnlyMyCast" src={Logo} height="48" />
              </Link>
              { 
              
              windowWidth >= 768 && 
                <>
                  <InputBase onChange={(e) => {setSearch(e.target.value)}} value={search} className={ darkmode === 'light' ? classes.search: classes.searchDark} placeholder="以完整ID搜尋節目" startAdornment={
                      <IconButton component={RLink} to={"/search/" + search} aria-label="search" size="small">
                          <SearchIcon/>
                      </IconButton>
                  }>
                  </InputBase>
                </>
                
              }
              <div className={classes.grow}/>
              { 
              
              windowWidth < 768 && 
              <Tooltip title="搜尋">
                <IconButton
                    edge="end"
                    color="inherit"
                    aria-label="searching"
                    component={RLink} 
                    to="/search"
                    className={classes.menuButton}
                    >
                    <SearchIcon />
                </IconButton>
              </Tooltip>
              }
              <Tooltip title="發佈單集">
                <Fab component={RLink} to="/uploadpodcast" color="primary" aria-label="add" size="small" className={classes.menuButton} edge="end" >
                      <AddIcon />
                </Fab>
              </Tooltip>
              <Darkmode />
          </Toolbar>
          </AppBar>

          <Drawer anchor="left" open={ sideBar } onClose={ ()=> setSideBar(false) }>
              <div className={ classes.list }
                  role="presentation"
                  onClick={ ()=>{ setSideBar(false) } }
                  onKeyDown={ ()=>{ setSideBar(false) } }>
                  <List>
                      <ListItem key="account">
                          <ListItemIcon><Avatar alt={props.user.name} src={props.user.avatar==="" ? "." : props.user.avatar} className={ classes.pink } /></ListItemIcon>
                          <Typography variant="body2" component="span">
                            {props.user.name}
                            <br/>
                            <Typography variant="caption" component="span">{props.userEmail}</Typography>
                          </Typography>
                      </ListItem>
                      <ListItem key="accountedit">
                      <ButtonGroup size="large" aria-label="outlined primary button group" fullWidth>
                        <Button key="accoutsetting" component={RLink} to="/account" variant="outlined"><AccountBoxIcon />設定</Button>
                        <Button key="logout" onClick={handleLogout} variant="outlined"><ExitToAppIcon />登出</Button>
                      </ButtonGroup>
                      </ListItem>
                  </List>
                  <Divider />
                  <List>
                  <ListItem button component={RLink} to="/podcastaccount" key="podcastsetting">
                          <ListItemIcon><GraphicEqIcon /></ListItemIcon>
                          <ListItemText primary="節目設定"></ListItemText>
                      </ListItem>
                      <ListItem button component={RLink} to="/uploadpodcast" key="publish">
                          <ListItemIcon><PublishIcon /></ListItemIcon>
                          <ListItemText primary="單集發佈"></ListItemText>
                      </ListItem>
                      <ListItem button component={RLink} to="/editpodcasts" key="editpod">
                          <ListItemIcon><EditIcon /></ListItemIcon>
                          <ListItemText primary="單集管理"></ListItemText>
                      </ListItem>
                  </List>
                  <Divider />
                  <List>
                  <ListItem button component={RLink} to="/subreq" key="subreq">
                          <ListItemIcon>
                              <Badge badgeContent={reqCount} color="primary">
                                  <InboxIcon />
                              </Badge>
                          </ListItemIcon>
                          <ListItemText primary="追蹤請求"></ListItemText>
                      </ListItem>
                    <ListItem button component={RLink} to="/fansadmin" key="fansadmin">
                          <ListItemIcon>
                            <FaceIcon />
                          </ListItemIcon>
                          <ListItemText primary="追蹤管理"></ListItemText>
                      </ListItem>
                  </List>
                  <Divider />
                  <List>
                    <ListItem button target="_blank" component={Link} underline="none" href="https://nnwa1689.gitbook.io/onlymycast-helpcenter/" key="help">
                            <ListItemIcon>
                                    <HelpIcon />
                            </ListItemIcon>
                            <ListItemText primary="說明支援"></ListItemText>
                    </ListItem>
                  </List>
                  <Divider />
                  <List alignItems="center">
                      <ListItem key="privatepolic" fontSize={5}>
                          <Link target="_blank" href="https://www.notes-hz.com/page/privacypolicy" variant="body2">隱私權</Link>
                          &nbsp;
                          <Link target="_blank" href="https://www.notes-hz.com/page/serviceRules" variant="body2">條款</Link>
                          &nbsp;
                          <Link target="_blank" href="https://www.notes-hz.com/page/readerService" variant="body2">聯繫</Link>
                      </ListItem>
                      <ListItem key="copyright" fontSize={5}>
                        <Typography variant="body2" color="textSecondary">
                          <Link target="_blank" href="https://lab.notes-hz.com/">
                            <span style={ {fontSize: "24px", color: "#028ff3", fontWeight: "bold"} }>Lab</span>
                            <span style={ {fontSize: "24px", color: "#FD3E49", fontWeight: "bold"} }>H</span>
                            <span style={ {fontSize: "24px", color: "#FF8738", fontWeight: "bold"} }>a</span>
                            <span style={ {fontSize: "24px", color: "#FFA900", fontWeight: "bold"} }>z</span>
                            <span style={ {fontSize: "24px", color: "#00A752", fontWeight: "bold"} }>u</span>
                            <span style={ {fontSize: "24px", color: "#007BEE", fontWeight: "bold"} }>y</span>
                            <span style={ {fontSize: "24px", color: "#9B49DF", fontWeight: "bold"} }>a</span>
                            </Link>
                        </Typography>
                      </ListItem>
                      <ListItem key="clientversion">
                        <Typography variant="subtitle2" color="textSecondary">Client:{ props.ver }</Typography>
                      </ListItem>
                  </List>
              </div>
          </Drawer>
      </div>
    );
}
export default NavBar;

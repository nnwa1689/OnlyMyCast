//react
import React, { useState, useEffect } from 'react';
import { Link as RLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
//customhook
import useWindowWidth from '../../Hook/useWindowWidth';
import UserMenu from './UserMenu';
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
import PublishIcon from '@material-ui/icons/Publish';
import EditIcon from '@material-ui/icons/Edit';
import Badge from '@material-ui/core/Badge';
import Link from '@material-ui/core/Link';
import GraphicEqIcon from '@material-ui/icons/GraphicEq';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import FaceIcon from '@material-ui/icons/Face';
import HelpIcon from '@material-ui/icons/Help';
import Tooltip from '@material-ui/core/Tooltip';
import InputBase from '@material-ui/core/InputBase';
//static
import LogoPink from '../../static/only-my-cast-pink.svg';
import Logo from '../../static/only-my-cast.svg';
import { Hidden } from '@material-ui/core';

const drawerWidth = 200;

const useStyles = makeStyles((theme) => ({
  root:{
   display: "flex", 
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
    grow: {
      flexGrow: 1,
    },
    search: {
      borderRadius: "0",
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
      borderRadius: "0",
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
    const [isMobile, setIsMobile] = useState(false);

    useEffect(
      ()=>{
        getReqCount();
      }
    )

    const drawerList = (
      <div className={ classes.list }
        role="presentation"
        onClick={ ()=>{ setSideBar(false) } }
        onKeyDown={ ()=>{ setSideBar(false) } }>
        <Toolbar>
          <Hidden smUp>
            <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
            onClick={ ()=>{ setSideBar(true) } }>
                <MenuIcon />
            </IconButton>
          </Hidden>
          <Link component={RLink} to="/" >
              <img alt="OnlyMyCast" src={LogoPink} height="48" />
          </Link>
        </Toolbar>
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
          <ListItem button target="_blank" component={Link} underline="none" href="https://onlymycast.com/category/46" key="help">
                  <ListItemIcon>
                          <HelpIcon />
                  </ListItemIcon>
                  <ListItemText primary="說明支援"></ListItemText>
          </ListItem>
        </List>
        <Divider />
        <List alignItems="center">
            <ListItem key="copyright" fontSize={5}>
              <Typography variant="body2" color="textSecondary" align="center">
                <Link href="https://studio-44s.tw/">
                  <span style={ {fontSize: "24px", color: "#FD3E49", fontWeight: "bold"} }>❤</span> 四拾四秒網頁製作所©
                </Link>
              </Typography>
            </ListItem>
            <ListItem key="clientversion">
              <Typography variant="subtitle2" color="textSecondary">Client:{ props.ver }</Typography>
            </ListItem>
        </List>
    </div>
    );

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
          <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
              <Hidden smUp>
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
                  <img alt="OnlyMyCast" src={LogoPink} height="48" />
                </Link>
              </Hidden>
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
                <Fab component={RLink} to="/uploadpodcast" aria-label="add" size="small" className={classes.menuButton} edge="end" >
                      <AddIcon />
                </Fab>
              </Tooltip>
              <UserMenu userName={ props.user.name } avatar={ props.user.avatar } email={ props.userEmail } />
          </Toolbar>
          </AppBar>

          <Hidden smUp implementation='css'>
            <Drawer variant="persistent" hideBackdrop="true" anchor="left" open={ sideBar } onClose={ ()=> setSideBar(false) }>
              { drawerList }
            </Drawer>
          </Hidden>

          <Hidden xsDown>
          <Drawer variant='permanent' anchor="left" open>
              { drawerList }
            </Drawer>
          </Hidden>
      </div>
    );
}
export default NavBar;

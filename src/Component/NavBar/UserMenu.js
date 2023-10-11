//react
import React, { useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Link as RLink } from 'react-router-dom';
//firebase
import firebase from "firebase/app";
import "firebase/auth";
//redux
import { useSelector, useDispatch } from 'react-redux';
import { setMode } from '../../Reducer/action';
//mui
import Fab from '@material-ui/core/Fab';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';



const useStyles = makeStyles((theme) => ({
    large: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
    pink: {
      color: "#FFFFFF",
      backgroundColor: "#FD3E49",
    },
}));

const StyledMenu = withStyles({
    
  })((props) => (
    <Menu
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      {...props}
    />
  ));


const UserMenu = (props) => {

    const classes = useStyles();
    const [isDarkmode, setButtonMode] = useState( useSelector(state => state.mode));
    const lightStyle = { background: '#f7f7f7' };
    const darkStyle = { background: 'rgb(24, 24, 24)', color: "white" };
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };  

    const handleMode = () => {
        if (isDarkmode === 'light') {
            setButtonMode('dark');
            dispatch(setMode('dark'));
        } else {
            setButtonMode('light');
            dispatch(setMode('light'));
        }
        handleClose();
    }

    const handleLogout = ()=>{
        firebase.auth().signOut().then(() => {
          // Sign-out successful.
          localStorage.removeItem('themeMode');
          window.location.reload();
        }).catch((error) => {
          // An error happened.
        });
      }


    return(
        <>
            <Fab onClick={ handleClick }  size="small" edge="end" >
                <Avatar alt={props.userName} src={props.avatar==="" ? "." : props.avatar} className={ classes.pink } />
            </Fab>
            <StyledMenu
                id="user-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
           
                <ListItem key="account">
                    <ListItemIcon><Avatar alt={props.userName} src={props.avatar==="" ? "." : props.avatar} className={ classes.pink } /></ListItemIcon>
                    <Typography variant="body2" component="span">
                    {props.userName}
                    <br/>
                    <Typography variant="caption" component="span">{props.email}</Typography>
                    </Typography>
                </ListItem> 
                <Divider />
                <MenuItem key="accoutsetting" component={RLink} to="/account" onClick={handleClose}>
                    <ListItemIcon><AccountBoxIcon fontSize='large'/></ListItemIcon>
                    <Typography variant="subtitle2" component="span">管理我的帳號</Typography>
                </MenuItem>
                {
                  /*
                                  <MenuItem onClick={handleMode}>
                    <ListItemIcon>
                        { isDarkmode == "light" ? <Brightness7Icon fontSize='large'/> : <Brightness4Icon fontSize='large'/> }
                    </ListItemIcon>    
                        { isDarkmode == "light" ? 
                        <Typography variant="subtitle2" component="span">
                            外觀：明亮主題
                        </Typography> : 
                        <Typography variant="subtitle2" component="span">
                            外觀：黑暗主題
                        </Typography>
                        }
                </MenuItem>
                   */
                }

                <Divider />
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon><ExitToAppIcon fontSize='large'/></ListItemIcon>
                    <Typography variant="subtitle2" component="span">登出</Typography>
                </MenuItem>
            </StyledMenu>
        </>

    );

}

export default UserMenu;
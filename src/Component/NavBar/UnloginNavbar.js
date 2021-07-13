//react
import React from 'react';
import { Link as RLink } from 'react-router-dom';
//firebase
import firebase from "firebase/app";
import "firebase/auth";
/*google themes */
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { fade, makeStyles } from '@material-ui/core/styles';
import { deepOrange } from '@material-ui/core/colors';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
//static
import LogoIcon from '../../static/only-my-cast-icon.svg'
import Logo from '../../static/only-my-cast.svg'

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(1),
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

const UnloginNavBar = (props) => {

    const classes = useStyles();
    return (
      <div>
          <AppBar color="secondary" position="fixed">
          <Toolbar>
              <Link component={RLink} to="/" >
                <img alt="OnlyMyCast" src={LogoIcon} width="48" height="48" />
              </Link>
              <div className={classes.grow}/>
              <Typography variant="h6">建立、收聽私人Podcast</Typography>
              <div className={classes.grow}/>
                <Button href="/signin" size="medium" variant="contained" color="primary">
                    登入
                </Button>
          </Toolbar>
          </AppBar>

      </div>
    );
}
export default UnloginNavBar;

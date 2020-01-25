import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Route, Link, BrowserRouter as Router,withRouter } from "react-router-dom";
import MyLogIn from "./MyLogIn";
import logo from '../img/logo2.png';


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function MyNavBar() {
  const classes = useStyles();

  return (
    <div data-spy="scroll" data-target=".navbar" data-offset="50">
       <nav className="navbar navbar-expand-sm fixed-top navnav"style={{backgroundColor:"transparent",}}>
         <div style={{backgroundColor:"#AFD275",width:"57.8%"}}>
          <img src={logo}alt="mylogo" style={{width:"15%",marginLeft:"2.5%"}}/>
        </div>
      </nav>
    </div>
  )
}
export default withRouter(MyNavBar)
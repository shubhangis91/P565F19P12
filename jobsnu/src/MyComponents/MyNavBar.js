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
       <nav className="navbar navbar-expand-sm fixed-top navnav"styles={{backgroundColor:"transparent",}}>
         <div className="col-3" style={{backgroundColor:"#AFD275"}}>
          <img src={logo}alt="mylogo" style={{width:"30%"}}/>
        </div>
      </nav>
    </div>
  )
}
export default withRouter(MyNavBar)
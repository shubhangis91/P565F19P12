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
import {useCookies,removeCookie,withCookies } from 'react-cookie';


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

function MyNavBar(props) {
  // const [cookies, setCookie] = useCookies(['userEmail'],['userId'],['isActive']);

  const classes = useStyles();
   const logOut = (event) => {
  //   // remove('isActive',{ path: '/' })
  //   // remove('userEmail',{ path: '/' })
  //   // removeCookie('userId',{ path: '/' })
  //   this.props.history.push("/");
  }
  return (
    <div data-spy="scroll" data-target=".navbar" data-offset="50">
       <nav className="navbar navbar-expand-sm fixed-top navnav"style={{backgroundColor:"white",}}>
         <div style={{backgroundColor:"#AFD275",width:"100%"}}>
          <img src={logo}alt="mylogo" style={{width:"6%",marginLeft:"2.5%"}}/>
          <Button onClick={logOut()} style={{float:"right",marginRight:"5%",marginTop:"1.5%"}}>Log Out</Button>
        </div>
      </nav>
    </div>
  )
}
export default withCookies( withRouter(MyNavBar))
import React from 'react';
import logo from './logo.svg';
import './App.css';
import Button from '@material-ui/core/Button';
import MyNavBar from './MyComponents/MyNavBar.js'
import {BrowserRouter as Router , Route, Link} from "react-router-dom"
import MyHomePage from "./MyComponents/MyHomePage"
import MyProfilePage from "./MyComponents/MyProfilePage"
import ForgotPassword from "./MyComponents/HomePageComp/ForgotPass/ForgotPassword"
import MyRecruiterPage from "./MyComponents/MyRecruiterPage"
// import MyProfilePageDark from "./MyComponents/MyProfilePageDark"



function App() {
  return (
    <Router>
    <Route path="/" exact component={MyHomePage}/>
    <Route path="/home" exact component={MyProfilePage}/>
    <Route path="/forgotPassword" exact component={ForgotPassword}/>
    <Route path="/homeRecruiter" exact component={MyRecruiterPage}/>
    {/* <Route path="/homeDarkMode" exact component={MyProfilePageDark}/> */}

    </Router>
  );
}

export default App;

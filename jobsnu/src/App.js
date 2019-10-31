import React from 'react';
import logo from './logo.svg';
import './App.css';
import Button from '@material-ui/core/Button';
import MyNavBar from './MyComponents/MyNavBar.js'
import {BrowserRouter as Router , Route, Link} from "react-router-dom"
import MyHomePage from "./MyComponents/MyHomePage"
import MyProfilePage from "./MyComponents/MyProfilePage"
import forgotPassword from "./MyComponents/HomePageComp/forgotPassword"


function App() {
  return (
    <Router>
    <Route path="/" exact component={MyHomePage}/>
    <Route path="/home" exact component={MyProfilePage}/>
    <Route path="/forgotPassword" exact component={forgotPassword}/>

    </Router>
  );
}

export default App;

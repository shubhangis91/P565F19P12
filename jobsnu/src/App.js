import React from 'react';
import logo from './logo.svg';
import './App.css';
import Button from '@material-ui/core/Button';
import MyNavBar from './MyComponents/MyNavBar.js'
import {BrowserRouter as Router , Route, Link} from "react-router-dom"
import MyLogIn from "./MyComponents/MyLogIn"
import MyHomePage from "./MyComponents/MyHomePage"


function App() {
  return (
    <Router>
    <Route path="/" exact component={MyHomePage}/>
    <Route path="/MyLogIn" component={MyLogIn}/>
    </Router>
  );
}

export default App;

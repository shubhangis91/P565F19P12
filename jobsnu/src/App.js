import React from 'react';
import {BrowserRouter as Router , Route, Link} from "react-router-dom"
import MyHomePage from "./MyComponents/MyHomePage"
import MyProfilePage from "./MyComponents/MyProfilePage"
import ForgotPassword from "./MyComponents/HomePageComp/ForgotPass/ForgotPassword"
import MyRecruiterPage from "./MyComponents/MyRecruiterPage"


function App() {
  return (
    <Router>
    <Route path="/" exact component={MyHomePage}/>
    <Route path="/home" exact component={MyProfilePage}/>
    <Route path="/forgotPassword" exact component={ForgotPassword}/>
    <Route path="/homeRecruiter" exact component={MyRecruiterPage}/>
    </Router>
  );
}

export default App;

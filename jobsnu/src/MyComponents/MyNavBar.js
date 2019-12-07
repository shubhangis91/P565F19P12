import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Tooltip from '@material-ui/core/Tooltip';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';

import {
  Route,
  Link,
  BrowserRouter as Router,
  withRouter
} from "react-router-dom";
import logo from "../img/logo2.png";
import { useCookies, setCookie, withCookies } from "react-cookie";
import { useState } from "react";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));

function MyNavBar(props) {
  const [cookies, setCookie, removeCookie] = useCookies([
    "userEmail",
    "userId",
    "isActive",
    "isRecruiter"
  ]);
  const [showButton, setShow] = useState(false);

  const classes = useStyles();
  const logOut = () => {
    console.log("Logging out and removing cookies");
    console.log(cookies["userEmail"]);
    console.log(cookies["userId"]);
    console.log(cookies["isNotActive"]);
    console.log(cookies["isRecruiter"]);
    setCookie("isNotActive", false, { path: "/" });
    setCookie("userEmail", false, { path: "/" });
    setCookie("userId", undefined, { path: "/" });
    setCookie("isRecruiter", false, { path: "/" });
    console.log(cookies["userEmail"]);
    console.log(cookies["userId"]);
    console.log(cookies["isNotActive"]);
    console.log(cookies["isRecruiter"]);
    pushToLogin();
  };
  const pushToLogin = () => {
    props.history.push("/");
  };
  const switchToRecruiter = () => {
    props.history.push("/homeRecruiter");
  };
  useEffect(() => {
    checkLogin();
    setRec();
  }, []);
  const checkLogin = () => {
    if (cookies["isNotActive"] == false) {
      pushToLogin();
    }
  };
    const setRec = () => {
    if (cookies["isRecruiter"] == 'false') {
      setShow(false);
    } else {
      setShow(true);
    }
    console.log(cookies["isRecruiter"]);
    console.log(showButton);

  };
  return (
    <div data-spy="scroll" data-target=".navbar" data-offset="50">
      <nav
        className="navbar navbar-expand-sm fixed-top navnav"
        style={{ backgroundColor: "white" }}
      >
        <div style={{ backgroundColor: "#AFD275", width: "100%" }}>
          <img
            src={logo}
            alt="mylogo"
            style={{ width: "6%", marginLeft: "2.5%" }}
          />
          <Button
            className={classes.menuButton}
            onClick={logOut}
            style={{
              float: "right",
              // backgroundColor: "#AFD275",
              color: "#ff4081",
              marginTop: "1.2%",
              borderRadius:"20vh",
            }}
          >
          
          <strong>Log Out</strong>
          </Button>
          {showButton && (
            <Tooltip title="Switch to Recruiter Profile">
            <Button
              className={classes.menuButton}
              onClick={switchToRecruiter}
              style={{
                float: "right",
                // backgroundColor: "#AFD275",
                color: "#ff4081",
                marginTop: "1.2%",
                borderRadius:"20vh",
              }}
            >
              <CompareArrowsIcon/>
            </Button>
            </Tooltip>
          )}
        </div>
      </nav>
    </div>
  );
}
export default withCookies(withRouter(MyNavBar));

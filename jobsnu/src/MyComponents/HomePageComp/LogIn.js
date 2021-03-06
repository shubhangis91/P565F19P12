import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import OTPbox from "./OTPbox";
import { withCookies, Cookies } from "react-cookie";
import { instanceOf } from "prop-types";
import { withRouter } from "react-router-dom";
//import { GoogleLogin } from "react-google-login";
import { GoogleAPI, GoogleLogin, GoogleLogout } from "react-google-oauth";
import { Tooltip } from "@material-ui/core";

const responseGoogle = response => {
  console.log(response);
};

class LogIn extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props);

    const { cookies } = props;
    this.checkIsActive(cookies);
    this.state = {
      email: "",
      password: "",
      otp: '111111',
      showOTPbox: false,
      passwordValid: false,
      emailValid: false,
      credentials: "",
      userIdCookies: cookies.get("userId"),
      userEmailCookies: cookies.get("userEmail"),
      isNotActive: cookies.get("isNotActive"),
      guestLogin: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.checkIsActive = this.checkIsActive.bind(this);
    this.pushToForgotPassword = this.pushToForgotPassword.bind(this);
    this.handleSubmitGuest = this.handleSubmitGuest.bind(this)
  }

  handleChange = event => {
    this.setState(
      {
        [event.target.name]: event.target.value
      },
      () => {
        this.validateEmail(event);
      }
    );
  };

  validateEmail(event) {
    var check = this.state.email.includes("@");
    this.setState({
      emailValid: check
    });
    console.log(this.state.validateEmail, check);
    this.validatePassword(event);
  }
  validatePassword(event) {
    var check = this.state.password.length >= 8;
    var check1 = this.state.password.match(/[A-Z]/g);
    var check2 = this.state.password.match(/[a-z]/g);
    var check3 = this.state.password.match(/[0-9]/g);
    this.setState({
      passwordValid: check1 && check && check2 && check3
    });
  }
  checkIsActive(cookies) {
    // const { cookies } = this.props;
    if (cookies.get("isNotActive") == "true") {
      console.log("user is logged in");
      console.log(cookies.get("isNotActive") == true);
      console.log(cookies.get("userEmail"));
      console.log(cookies.get("isNotActive"));
      this.props.history.push("/home");
    } else {
      console.log("No cookie or login");
      console.log(cookies.get("isNotActive") == "true");
      console.log(cookies.get("userEmail"));
      console.log(cookies.get("isNotActive"));
      cookies.set("userId", undefined, { path: "/" });
      cookies.set("userEmail", false, { path: "/" });
      cookies.set("isNotActive", false, { path: "/" });
      cookies.set("isRecruiter", false, { path: "/" });
      cookies.set("otherUserId", 2, { path: "/" });
      cookies.set("tabValue", 0, { path: "/" });
      console.log(cookies.get("userEmail"));
      console.log(cookies.get("isNotActive"));
    }
  }
  handleSubmit(event) {
    const { cookies } = this.props;
    this.setState({
      showOTPbox: true
    });
    // event.preventDefault();
    const user = {
      email: this.state.email,
      password: this.state.password,
      otp: this.state.otp,
      guestLogin:this.state.guestLogin,
    };
    console.log(user);
    axios.post("/mfaLogin", { user }).then(res => {
      console.log(res);
      console.log(res.data);
      if (res.data.invalid == 1) {
        this.setState({
          credentials: false
        });
      } else {
        this.setState({
          credentials: true
        });
      }

      if (res.data.verified == 1) {
        axios.post("/login", { user }).then(resp => {
          console.log(resp.data);
          cookies.set("userId", resp.data.userId);
          if (resp.data.isRecruiter == "Y") {
            cookies.set("isRecruiter", true, { path: "/" });
          }
          console.log(cookies.get("isRecruiter"));
          console.log(cookies.get("userId"));
        });
      }
    });
  }
  pushToForgotPassword() {
    this.props.history.push("/forgotPassword");
  }
  handleSubmitGuest(){
    this.setState({
      email:'risabgajra@gmail.com',
      password:'Abc11111',
      guestLogin:true,
    },this.handleSubmit)
    console.log(this.state.email)
  }
  render() {
    return (
      <div
        className="col-5"
        style={{
          background: "linear-gradient(to bottom right,#e7717d, #f0a9b1)"
        }}
      >
        <Form
          className="mb-6"
          style={{
            marginTop: "25%",
            marginLeft: "10%",
            marginRight: "10%",
            marginBottom: "45%"
          }}
        >
          <h2 style={{ color: "#7e685a" }}>
            Put in your Log-in Detials here:{" "}
          </h2>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <input
              className="form-control"
              type="email"
              name="email"
              placeholder="Enter email"
              onChange={this.handleChange}
              required
            />
            {!this.state.emailValid && (
              <Form.Text className="text-muted">
                Please enter a valid email
              </Form.Text>
            )}
            {this.state.emailValid && <br />}
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              onChange={this.handleChange}
              required
            />
            {!this.state.passwordValid && (
              <Form.Text className="text-muted">
                Your password must be 8-15 characters, contain one of:upper
                case, lower case and special character
              </Form.Text>
            )}
            {this.state.passwordValid && <br />}
          </Form.Group>
          <Form.Group controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Remember Me" />
          </Form.Group>
          <Button
            variant="green"
            disabled={!(this.state.emailValid && this.state.passwordValid)}
            onClick={this.handleSubmit}
          >
            LogIn
          </Button>
          <Button
            variant="green"
            onClick={this.props.hideLogin}
            style={{ marginLeft: "2.5%" }}
          >
            Register Me!
          </Button>

          
          {/* <GoogleAPI
            clientId="69721391201-skpelns354dcip3jnm7nfrb99vgeklbe.apps.googleusercontent.com"
            // onUpdateSigninStatus={CALLBACK}
            //   onInitFailure={CALLBACK}
          >
            <div> */}
              {/* <div>
                <br/>
                <GoogleLogin />
              </div>
            </div>
          </GoogleAPI> */}
          {/* <GoogleLogin
              clientId="69721391201-skpelns354dcip3jnm7nfrb99vgeklbe.apps.googleusercontent.com"
              render={renderProps => (
                <Button
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  Login With Gmail
                </Button>
              )}
              buttonText="Login"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={"single_host_origin"}
            /> */}
            
          <div style={{ marginTop: "2.5%" }}>
          <Tooltip title="Click here to try out the job seeker and recruiter views">
          <h4
              style={{
                color: "#7E685A",
                cursor: "pointer",
                textDecoration: "underline",
                fontSize:"20px,"
              }}
              onClick={this.handleSubmitGuest}
            >
              {" "}
              Click here to try all the features of the website
            </h4>
            </Tooltip>
            <br/>
            <img
              src="https://icon-library.net/images/forgot-icon/forgot-icon-11.jpg"
              style={{ width: "20px" }}
            />

            <a
              style={{
                color: "#7E685A",
                cursor: "pointer",
                textDecoration: "underline"
              }}
              onClick={this.pushToForgotPassword}
            >
              {" "}
              I forgot my password, Help!
            </a>
          </div>
          {this.state.showOTPbox && !this.state.credentials && (
            <Form.Text className="text-muted">Invalid credentials</Form.Text>
          )}
        </Form>
        {this.state.showOTPbox && this.state.credentials && (
          <OTPbox
            fade={this.state.showOTPbox}
            email={this.state.email}
            otp={this.state.otp}
            login={1}
          />
        )}
      </div>
    );
  }
}

export default withRouter(withCookies(LogIn));

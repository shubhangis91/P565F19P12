import React from "react"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import axios from "axios"
import OTPbox from "./OTPbox"
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import { withRouter } from 'react-router-dom';


class LogIn extends React.Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
      };

    constructor(props)   {
        super(props);

        const { cookies } = props;
        this.checkIsActive(cookies)
        this.state = {
            email:  "",
            password: "",
            otp:Math.floor(100000 + Math.random() * 900000),
            showOTPbox: false,
            passwordValid: false,
            emailValid: false,
            credentials: "",
            userIdCookies: cookies.get('userId'),
            userEmailCookies: cookies.get('userEmail'),
            isNotActive: cookies.get('isNotActive'),
        }
        this.handleChange=this.handleChange.bind(this)
        this.handleSubmit=this.handleSubmit.bind(this)
        this.validateEmail=this.validateEmail.bind(this)
        this.validatePassword=this.validatePassword.bind(this)
        this.checkIsActive=this.checkIsActive.bind(this)
        
    } 

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value, 
            }, () => {this.validateEmail(event) });
        
    }

    validateEmail(event){
        var check = this.state.email.includes("@");
        this.setState({
            emailValid:check, 
        })
        console.log(this.state.validateEmail,check)
        this.validatePassword(event)
    }
    validatePassword(event){
        var check = this.state.password.length >= 8;
        var check1 = this.state.password.match(/[A-Z]/g)
        var check2 = this.state.password.match(/[a-z]/g)
        var check3 = this.state.password.match(/[0-9]/g)
        this.setState({
            passwordValid:check1&&check&&check2&&check3, 
        })
    }
    checkIsActive(cookies){
        // const { cookies } = this.props;
        if(cookies.get('isNotActive')=='true')    {
            console.log("user is logged in")
            console.log((cookies.get('isNotActive')==true))
            console.log(cookies.get('userEmail'))
            console.log(cookies.get('isNotActive'))
            this.props.history.push("/home");
            }
        else{
            console.log("No cookie or login")
            console.log((cookies.get('isNotActive')=='true'))
            console.log(cookies.get('userEmail'))
            console.log(cookies.get('isNotActive'))
            cookies.set('userId', undefined, { path: '/' })
            cookies.set('userEmail', false, { path: '/' })
            cookies.set('isNotActive', false, { path: '/' })
            console.log(cookies.get('userEmail'))
            console.log(cookies.get('isNotActive'))
        }
    }
    handleSubmit(event){
        const { cookies } = this.props;
        this.setState({
            showOTPbox:true, 
        })
        event.preventDefault();
        const user = {
            email: this.state.email,
            password: this.state.password,
            otp: this.state.otp,
        };
        console.log(user)
        axios
            .post("/mfaLogin", {user})
            .then(res => {
                console.log(res) 
                console.log(res.data)
                if (res.data.invalid==1){
                    this.setState({
                        credentials:false, 
                    })
                }
                else{
                    this.setState({
                        credentials:true, 
                    })
                }

            })
    }


    render()    {
        return(

            <div className="col-5" style={{background: "linear-gradient(to bottom right,#e7717d, #f0a9b1)"}}>  
                <Form className='mb-6' style={{marginTop: "25%", marginLeft: "10%",marginRight:"10%", marginBottom: "45%"}}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <input className="form-control"type="email" name="email" placeholder="Enter email" onChange={this.handleChange} required/>
                        {!this.state.emailValid&&<Form.Text className="text-muted" >
                             Please enter a valid email
                        </Form.Text>}
                        {this.state.emailValid&&<br/>}
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword" >
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" name="password" onChange={this.handleChange} required />
                        {!this.state.passwordValid&&<Form.Text className="text-muted" >
                                 Your password must be 8-15 characters, contain one of:upper case, lower case and special character
                            </Form.Text>}
                        {this.state.passwordValid&&<br/>}
                    </Form.Group>
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Remember Me" />
                    </Form.Group>
                    <Button variant="green" disabled={!((this.state.emailValid)&&(this.state.passwordValid))} onClick={this.handleSubmit}>
                        LogIn
                    </Button>
                    <Button variant="green" onClick= {this.props.hideLogin} style={{marginLeft: "2.5%"}} >
                        Register Me!
                    </Button>
                    <div style={{marginTop:"2.5%"}}>
                        <img src="https://icon-library.net/images/forgot-icon/forgot-icon-11.jpg" style={{width:"20px"}}/>
                        <a style={{color:"#7E685A" }} href="/forgotPassword">     I forgot my password, Help!</a>
                    </div>
                    {(this.state.showOTPbox)&& !(this.state.credentials)&& <Form.Text className="text-muted" >
                                                    Invalid credentials
                                                </Form.Text>}
                </Form>
                {(this.state.showOTPbox)&& this.state.credentials&& < OTPbox fade= {this.state.showOTPbox} email= {this.state.email} otp={this.state.otp} login={1}/>}
    
            </div>
        )
    }

}

export default withRouter(withCookies(LogIn))
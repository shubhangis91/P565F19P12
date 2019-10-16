import React from "react"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import axios from "axios"
import OTPbox from "./OTPbox"

class LogIn extends React.Component {
    constructor(){
        super()
        this.state = {
            email:  "",
            password: "",
            otp:Math.floor(100000 + Math.random() * 900000),
            showOTPbox: false,
        }
        this.handleChange=this.handleChange.bind(this)
        this.handleSubmit=this.handleSubmit.bind(this)
    } 
    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value 
        })
    }
    handleSubmit(event){
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
            .post("url", {user})
            .then(res => {
                console.log(res) 
                console.log(res.data)
            })
    }

    render()    {
        return(

            <div className="col-5" style={{background: "linear-gradient(to bottom right,#e7717d, #f0a9b1)"}}>  
                <Form className='mb-6' style={{marginTop: "25%", marginLeft: "10%",marginRight:"10%", marginBottom: "45%"}}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <input className="form-control"type="email" name="email" placeholder="Enter email" onChange={this.handleChange} required pattern="/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/"/>
                        <Form.Text className="text-muted" >
                        We'll never share your email with anyone else.{this.state.email}
                        </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword" >
                        <Form.Label>Password{this.state.password}</Form.Label>
                        <Form.Control type="password" placeholder="Password" name="password" onChange={this.handleChange} required />
                    </Form.Group>
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Remember Me" />
                    </Form.Group>
                    <Button onClick={this.handleSubmit}
                        style={{
                            backgroundColor:"#AFD275",
                            borderColor:"#7E685A", 
                            color:"#7E685A"
                            }}>
                        LogIn
                    </Button>
                    <Button onClick= {this.props.hideLogin} style={{marginLeft: "1%",backgroundColor:"#AFD275",borderColor:"#7E685A", color:"#7E685A"}} >
                        I am new, Register Me!
                    </Button>
                    <div style={{marginTop:"2.5%"}}>
                        <img src="https://icon-library.net/images/forgot-icon/forgot-icon-11.jpg" style={{width:"20px"}}/>
                        <a style={{color:"#7E685A" }} href="/forgotPassword">     I forgot my password, Help!</a>
                    </div>
                </Form>
                {(this.state.showOTPbox)&& < OTPbox fade= {this.state.showOTPbox} otp={this.state.otp}/>}
            </div>
        )
    }

}

export default LogIn 
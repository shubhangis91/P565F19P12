import React from "react"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import axios from "axios"
var classNames = require('classnames');

 
class Register extends React.Component {
    constructor(){
        super()
        this.state = {
            email:  "",
            password: "",
            rePassword:"",
            passwordValid:true,

        }
        this.handleChange=this.handleChange.bind(this)
        this.validatePassword=this.validatePassword.bind(this)
        this.handleSubmit=this.handleSubmit.bind(this)
    } 
    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value 
        })
        this.validatePassword();
    }
    validatePassword(){
        if (this.password==this.rePassword) {
            this.setState({
                passwordValid:true
            })
        }
        else{
            this.setState({
                passwordValid:false
            })
        }
    }
    handleSubmit(event){
        event.preventDefault();
        const user = {
            email: this.state.email,
            password: this.state.password,
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
        const btnClass = classNames({
            '': !this.state.passwordValid,
            '': this.state.passwordValid,
          }); 
        return(

            <div className="col-5" style={{background: "linear-gradient(to bottom right,#e7717d, #f0a9b1)"}}>  
                <Form className='mb-6' style={{marginTop: "25%", marginLeft: "10%",marginRight:"10%", marginBottom: "45%"}}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" name="email" placeholder="Enter email" onChange={this.handleChange} required/>
                        <Form.Text className="text-muted" >
                        We'll never share your email with anyone else.{this.state.email}
                        </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword" >
                        <Form.Label>Password{this.state.password}</Form.Label>
                        <Form.Control type="password" placeholder="Password" name="password" onChange={this.handleChange} required/>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword" >
                        <Form.Label>Re-type Password{this.state.repassword}</Form.Label>
                        <Form.Control type="password" placeholder="Same Password" name="repassword" onChange={this.handleChange} required/>
                    </Form.Group>
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Remember Me" />
                    </Form.Group>
                    <Button className={btnClass} onClick={this.handleSubmit}style={{backgroundColor:"#AFD275",borderColor:"#7E685A", color:"#7E685A"}}>
                        Register
                    </Button>
                    <Button onClick={this.props.hideLogin} style={{marginLeft: "1%", backgroundColor:"#AFD275",borderColor:"#7E685A", color:"#7E685A" } }>
                        I already have a LogIn! 
                    </Button>
                </Form>
            </div>
        )
    }
}

export default Register 
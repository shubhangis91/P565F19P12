import React from "react"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import { withRouter } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import axios from "axios"
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
class OTPbox extends React.Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
      };
    constructor(props){
        super(props);
        const { cookies } = props;
        this.state={
            otpvalue: "",
            otpvalid: true,
        }
        this.handleChange=this.handleChange.bind(this)
        this.handleSubmit=this.handleSubmit.bind(this)
    }
    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value 
        })
    }
    handleSubmit(){
        const { cookies } = this.props;
        if(this.state.otpvalue==this.props.otp) {
            console.log("logging user In")
            //console.log(cookies.get('userEmail'))
            //console.log(cookies.get('userId'))
            console.log(cookies.get('isNotAtive'))
            if(this.props.login==1) {
                cookies.set('userId', 1, { path: '/' })
            }
            else{  
                cookies.set('userId', 3, { path: '/' })
            }
            cookies.set('isNotActive', true, { path: '/' })
            cookies.set('userEmail', this.props.email, { path: '/' })
            //console.log(cookies.get('userEmail'))
            console.log(cookies.get('userId'))
            //console.log(cookies.get('isNotActive'))
            this.setState({
                otpvalid:true,
            })
            const user = {
                valid: this.state.otpvalid,
            };
            console.log(user)
            axios
                .post("/verify", {user})
                .then(res => {
                    console.log(res) 
                    console.log(res.data)
                })
                this.props.history.push("/home");
        }
        else {
            this.setState({
                otpvalid:false,
            })
        }
        console.log(this.state.otpvalue,this.props.otp)

    }
    render()    {
        return(
            <Modal show={this.props.fade}>
                <Modal.Header closeButton>
                    Please enter the 6 digit OTP emailed to you below 
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="checkOTP">
                            <Form.Control type="password" placeholder="OTP" name="otpvalue" onChange={this.handleChange} required />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick= {this.handleSubmit} style={{marginLeft: "1%",backgroundColor:"#AFD275",borderColor:"#7E685A", color:"#7E685A"}} >
                        Sumbit OTP
                    </Button>
                    <br/>
                </Modal.Footer>
                {!(this.state.otpvalid)&&(<Alert variant={'danger'}>Invalid OTP</Alert>)}
            </Modal>
        )}
}
export default withCookies(withRouter(OTPbox));
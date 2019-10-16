import React from "react"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
class OTPbox extends React.Component {
    constructor(){
        super()
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
    handleSubmit(event){
        if(this.state.otpvalue==this.props.otp) {
            this.setState({
                otpvalid:true,

            })
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
            <div>
                <Form>
                    <Form.Group controlId="checkOTP">
                        <Form.Label>Please enter the 6 digit OTP emailed to you below {this.props.otp}</Form.Label>
                        <Form.Control type="otp" placeholder="OTP" name="otpvalue" onChange={this.handleChange} required />
                    </Form.Group>
                    <Button onClick= {this.handleSubmit} style={{marginLeft: "1%",backgroundColor:"#AFD275",borderColor:"#7E685A", color:"#7E685A"}} >
                        Sumbit OTP
                    </Button>
                    {!(this.state.otpvalid)&&(<p>Invalid OTP</p>)}
                </Form>
            </div>
        )}
}
export default OTPbox
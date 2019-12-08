import React, { useState } from "react";
import MyNavBar from "../../MyNavBar";
import TextField from "@material-ui/core/TextField";
import Form from "react-bootstrap/Form";
import Axios from "axios";
import { Button } from "@material-ui/core";
export default function ResetPassword(props) {
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);

  const validatePassword = () => {
    console.log(password + rePassword);
    var check = password.length >= 8;
    var check1 = password.match(/[A-Z]/g);
    var check2 = password.match(/[a-z]/g);
    var check3 = password.match(/[0-9]/g);
    if (password == rePassword) {
      setPasswordValid(true && check1 && check && check2 && check3);
    } else {
      setPasswordValid(false);
    }
  };
  const setPasswordFunc = (event) =>{
    setPassword(event.target.value)
    validatePassword()
  }
  const setRePasswordFunc = (event) =>{
    setRePassword(event.target.value)
    validatePassword()
  }
  const handleSubmit = () => {
    console.log(password + rePassword);
    Axios.get("/forgotPassword?email=").then(res => {
      console.log(res.data);
    });
  };
  return (
    <div>
      <Form
        className="mb-6"
      >
        <Form.Group>
          <Form.Label>Password</Form.Label>

          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            onChange={setPasswordFunc}
            required
          />
          {!passwordValid && (
            <Form.Text className="text-muted">
              Your password must be 8-15 characters, contain one of:upper case,
              lower case and special character
            </Form.Text>
          )}
          {passwordValid && <br />}
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Re-type Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Same Password"
            name="rePassword"
            onChange={setRePasswordFunc}
            required
          />
        </Form.Group>
        <Form.Group controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Remember Me" />
        </Form.Group>
        <Button
          variant="green"
          disabled={passwordValid}
          onClick={handleSubmit}
        >
          Set Password
        </Button>
        {!(passwordValid) && <Form.Text className="text-muted">
                        Your password and Retype password fields should be matching.
                    </Form.Text>}
      </Form>
    </div>
  );
}

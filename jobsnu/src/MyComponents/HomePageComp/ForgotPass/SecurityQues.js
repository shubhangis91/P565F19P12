import React, { useState } from "react";
import MyNavBar from "../../MyNavBar";
import TextField from "@material-ui/core/TextField";
import Form from "react-bootstrap/Form";
import Axios from "axios";
import { Button } from "@material-ui/core";
import ResetPassword from "./ResetPassword";
export default function SecurityQues(props) {
  const [answer1, setAns1] = useState(false);
  const [answer2, setAns2] = useState(false);
const [reset,setReset]=useState(false);


  const setAns1Func = (event) => {
      setAns1(event.target.value)
  }
  const setAns2Func = (event) => {
    setAns2(event.target.value)
}
  const handleSubmit = () => {
      console.log(answer1+answer2)
    if (answer1 == props.answer1 && answer2 == props.answer2) {
      console.log("correct");
      setReset(true)
    }
   
  };
  return (
    <div>
      <Form
        className="mb-6"
      >
          {!reset&&<div>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>{props.question1}</Form.Label>
          <input
            className="form-control"
            type="email"
            name="email"
            placeholder="Enter Answer"
            onChange={setAns1Func}
            required
          />
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>{props.question2}</Form.Label>
          <input
            className="form-control"
            type="email"
            name="email"
            placeholder="Enter Answer"
            onChange={setAns2Func}
            required
          />
        </Form.Group>
        <Button variant="green" onClick={handleSubmit}>
          Sumbit
        </Button></div>}
        {reset&&<ResetPassword/>}
      </Form>
    </div>
  );
}

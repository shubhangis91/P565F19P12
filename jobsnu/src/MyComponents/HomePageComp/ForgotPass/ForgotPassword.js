import React, { useState } from "react";
import MyNavBar from "../../MyNavBar";
import TextField from "@material-ui/core/TextField";
import Form from "react-bootstrap/Form";
import Axios from "axios";
import { Button } from "@material-ui/core";
import SecurityQues from "./SecurityQues";
export default function ForgotPassword(props) {
  const [email, setEmail] = useState("");
  const [valid, setValid] = useState(false);
  const [showQues, SetShowQues] = useState(false);

  const [ques, setQues] = useState({
    answer1: "",
    answer2: "",
    question1: "",
    question2: "",
    userId: ""
  });
  const validateEmail = event => {
    var check = email.includes("@");
    setValid(check);
  };
  const handleChange = event => {
    setEmail(event.target.value);
    validateEmail(event);
    console.log(email);
  };
  const handleSubmit = () => {
    console.log("/forgotPassword?email=" + email);
    Axios.get("/forgotPassword?email=" + email).then(res => {
      console.log(res.data);
      setQues(res.data);
      SetShowQues(true)
      console.log(showQues)
    });
  };
  return (
    <div>
      <Form
        className="mb-6"
        style={{
          marginTop: "25%",
          marginLeft: "30%",
          marginRight: "30%",
          marginBottom: "45%"
        }}
      >
        {!showQues&&<div><Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <input
            className="form-control"
            type="email"
            name="email"
            placeholder="Enter email"
            onChange={handleChange}
            required
          />
          {!valid && (
            <Form.Text className="text-muted">
              Please enter a valid email
            </Form.Text>
          )}
          {valid && <br />}
        </Form.Group>
        <Button variant="green" disabled={!valid} onClick={handleSubmit}>
          Reset
        </Button>
        </div>
}
      {showQues&&<SecurityQues
        answer1={ques.answer1}
        answer2={ques.answer2}
        question1={ques.question1}
        question2={ques.question2}
        userId={ques.userId}
      />}
      </Form>

    </div>
  );
}

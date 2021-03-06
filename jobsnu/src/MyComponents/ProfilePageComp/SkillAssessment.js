import React, { useState, useEffect } from "react";
import { Fab, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Axios from "axios";
import { useCookies } from "react-cookie";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      marginTop: theme.spacing(1)
    }
  },
  extendedIcon: {
    marginRight: theme.spacing(1)
  },
  paper: {
    padding: theme.spacing(3, 2),
  },
}));

export default function SkillAssessment(props) {
  const classes = useStyles();
  const [cookies, setCookie] = useCookies(["userEmail", "userId"]);
  const [questions, setQuestion] = useState([]);
  const [showquestions, setShowQuestion] = useState(true);
  const [score, showScore] = useState(false);
  const [user, setValues] = React.useState({
    userId: cookies["userId"],
    skillName: "",
    answersArr: [
      { id: 1, answer: "d" },
      { id: 2, answer: "a" },
      { id: 3, answer: "b" },
      { id: 4, answer: "b" },
      { id: 5, answer: "a" }
    ]
  });
  const [answers, setAnswers] = React.useState([
    { id: "1", answer: "b" },
    { id: "2", answer: "b" },
    { id: "3", answer: "b" },
    { id: "4", answer: "b" }
  ]);
  const handleChange = id => event => {
    //setValues({ ...answers, [name]: event.target.value });
    console.log(id);
    console.log(event.value);
    console.log(event.name);
  };
  const getAssessment = event => {
    console.log(event);
    setValues({ ...user, skillName: event });
    setShowQuestion(false);
    console.log(user);
    Axios.get("/skillAssessment?skillName=" + event).then(res => {
      console.log(res.data);
      setQuestion(res.data);
    });
  };
  const submit = () => {
    Axios.post("./skillAssessmentScore", { user }).then(res => {
      console.log(res.data);
      setShowQuestion(true);
      showScore(res.data.score);
    });
  };
  return (
    <div className={classes.root}>
      {showquestions && !score && (
        <div>
          <h3>Start a skill Assessment of your choice:</h3>
          <Fab
            variant="extended"
            color="secondary"
            id="Java"
            className={classes.extendedIcon}
            onClick={() => getAssessment("Java")}
          >
            Java
          </Fab>
          <Fab
            variant="extended"
            color="secondary"
            id="Android"
            className={classes.extendedIcon}
            onClick={() => getAssessment("Android")}
          >
            Android
          </Fab>
        </div>
      )}
      {!showquestions && (
        <div>
          {questions.map((question, i) => (
            <div>
              <h4>{question.question}</h4>
              <RadioGroup
                aria-label="Answer:"
                name={question.id}
                onChange={handleChange(question.id)}
              >
                {question.choices.a && (
                  <FormControlLabel
                    label={question.choices.a}
                    control={<Radio />}
                    value="a"
                  />
                )}
                {question.choices.b && (
                  <FormControlLabel
                    label={question.choices.b}
                    control={<Radio />}
                    value="b"
                  />
                )}
                {question.choices.c && (
                  <FormControlLabel
                    label={question.choices.c}
                    control={<Radio />}
                    value="c"
                  />
                )}

                {question.choices.d && (
                  <FormControlLabel
                    label={question.choices.d}
                    control={<Radio />}
                    value="d"
                  />
                )}

                {question.choices.e && (
                  <FormControlLabel
                    label={question.choices.e}
                    control={<Radio />}
                    value="e"
                  />
                )}
              </RadioGroup>
            </div>
          ))}
          <Button
            style={{
              backgroundColor: "#afd275",
              color: "#7e685a",
              marginLeft: "110vh"
            }}
            onClick={submit}
          >
            Submit!
          </Button>
        </div>
      )}
      {score && (
        <Paper className={classes.paper} style={{marginLeft:"50vh",marginTop:"30vh",backgroundColor:"#fff0f2"}}>
          <h3 style={{ color: "#ff4081"}}>You scored {score} on our test!</h3>
        </Paper>
      )}
    </div>
  );
}

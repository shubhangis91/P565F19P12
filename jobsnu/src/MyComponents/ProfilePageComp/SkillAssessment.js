import React, { useState, useEffect } from "react";
import { Fab } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Axios from "axios";
const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      marginTop: theme.spacing(1)
    }
  },
  extendedIcon: {
    marginRight: theme.spacing(1)
  }
}));

export default function SkillAssessment(props) {
  const classes = useStyles();
  const getAssessment = (event) => {
    console.log(event);
    Axios
      .get("/skillAssessment?skillName=" + event).then(res => {
    console.log(res)
  })}
  return (
    <div className={classes.root}>
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
  );
}

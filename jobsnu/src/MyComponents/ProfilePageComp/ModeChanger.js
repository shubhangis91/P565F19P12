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
  }
  return (
    <div className={classes.root}>
      <h3>Select A theme Of your Choice</h3>
      <Fab
        variant="extended"
        color="secondary"
        id="Dark Mode"
        className={classes.extendedIcon}
        onClick={() => getAssessment("Dark")}
      >
        Dark mode
      </Fab>
      <Fab
        variant="extended"
        color="secondary"
        id="Neon mode"
        className={classes.extendedIcon}
        onClick={() => getAssessment("Neon")}
      >
        Neon
      </Fab>
    </div>
  );
}

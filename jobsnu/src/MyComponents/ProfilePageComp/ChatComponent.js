import React, { useState, useEffect } from "react";
import { Fab } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ChatComponentRemote from './chat/ChatComponent'

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

export default function ChatComponent(props) {
  const classes = useStyles();
  const log = (event) => {
    console.log(event);
  };
  return (
    <div className={classes.root}>
      <h3>Chat here:</h3>
      <ChatComponentRemote/>
    </div>
  );
}

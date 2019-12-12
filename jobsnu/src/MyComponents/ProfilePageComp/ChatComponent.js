import React, { useState, useEffect } from "react";
import { Fab } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ChatComponentRemote from './chat/ChatComponent'


export default function ChatComponent(props) {
  const log = (event) => {
    console.log(event);
  };
  return (
    <div>
      <ChatComponentRemote/>
    </div>
  );
}

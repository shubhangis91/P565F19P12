import React, { useState, useEffect } from 'react';
import { ChatkitProvider, TokenProvider } from '@pusher/chatkit-client-react';
import './App.css';
import Chat from './Chat';
import UserList from './UserList';
import chatkitLogo from './chatkit-logo.svg';
import { useCookies } from "react-cookie";
import Axios from 'axios';

const tokenProvider = new TokenProvider({
  url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/37bc05a7-986f-45ba-ab7e-8ad47510f2f2/token',
});
const instanceLocator = 'v1:us1:37bc05a7-986f-45ba-ab7e-8ad47510f2f2';

function ChatComponent() {
  const [cookies, setCookie] = useCookies(["tabValue", "userId",'otherUserId']);
  const refresh = () => {
    setCookie("tabValue",0)
    window.location.reload(false);
  }
  setCookie("tabValue",4)
  const [chats,setChats]=useState([])
  const [otherUser,setOtherUser]=useState(cookies["otherUserId"]);
  const [flag,setFlag]=useState(true)
  const urlParams = new URLSearchParams(window.location.search);
  const userId = cookies["userId"]
  console.log(otherUser)
  return (
    <div className="Chatapp">
        <>
          <div className="Chatapp__chatwindow">
          <ChatkitProvider
              instanceLocator={instanceLocator}
              tokenProvider={tokenProvider}
              userId={userId}
            >
              <UserList setOtherUser={setOtherUser} setFlag={setFlag} refresh={refresh}/>
               <Chat otherUserId={otherUser} />
            </ChatkitProvider>
          </div>
        </>
      <div className="Chatapp__backdrop">
        <img
          className="Chatapp__backdrop__logo"
          src={chatkitLogo}
          alt="Chatkit logo"
        />
      </div>
    </div>
  );
}

export default ChatComponent;

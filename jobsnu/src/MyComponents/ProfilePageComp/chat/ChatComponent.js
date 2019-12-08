import React from 'react';
import { ChatkitProvider, TokenProvider } from '@pusher/chatkit-client-react';
import './App.css';
import Chat from './Chat';
import UserList from './UserList';
import chatkitLogo from './chatkit-logo.svg';
import { useCookies } from "react-cookie";

const tokenProvider = new TokenProvider({
  url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/37bc05a7-986f-45ba-ab7e-8ad47510f2f2/token',
});
const instanceLocator = 'v1:us1:37bc05a7-986f-45ba-ab7e-8ad47510f2f2';

function ChatComponent() {
  const [cookies, setCookie] = useCookies(["userEmail", "userId"]);

  const urlParams = new URLSearchParams(window.location.search);
  const userId = cookies["userId"]
  const otherUserId = "1";

  return (
    <div className="App">
        <>
          <div className="App__chatwindow">
          <ChatkitProvider
              instanceLocator={instanceLocator}
              tokenProvider={tokenProvider}
              userId={userId}
            >
              <UserList userId={userId}/>
              <Chat otherUserId={otherUserId} />
            </ChatkitProvider>
          </div>
        </>
      <div className="App__backdrop">
        <img
          className="App__backdrop__logo"
          src={chatkitLogo}
          alt="Chatkit logo"
        />
      </div>
    </div>
  );
}

export default ChatComponent;

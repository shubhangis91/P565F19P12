import React, { useState, useEffect } from 'react';
import './UserList.css';
import defaultAvatar from './default-avatar.png';
import { useCookies } from "react-cookie";
import Axios from 'axios';


function UserList( props ) {

  const [cookies, setCookie] = useCookies(["userEmail", "userId",'otherUserId']);
  const [chats,setChats]=useState([])
  const userId = cookies["userId"]
  const getUserChats=()=>{
    Axios
      .get("./getUserChats?userId="+userId)
      .then(res=>{
        //console.log(res.data)
        setChats(res.data)
      })
    }
    useEffect(() => {
      getUserChats()
    },[]);
    const setOtherUserId = (chat) => {
      props.setFlag(false)
      console.log(chat.member_user_ids.filter(e=>e!=cookies["userId"]))
      setCookie('otherUserId',chat.member_user_ids.filter(e=>e!=cookies["userId"])[0])
      props.setOtherUser(chat.member_user_ids.filter(e=>e!=cookies["userId"])[0])
      props.setFlag(true)
      props.refresh()
    }
  return (
    <div className="UserList">
      <div className="UserList__titlebar">
        <img
          src={defaultAvatar}
          className="UserList__titlebar__avatar"
          alt="avatar"
        />
<span className="UserList__titlebar__logged-in-as">{userId}</span>
      </div>
      <div className="UserList__container">
        <ul className="UserList__container__list">
          {chats.map((chat, i) => (
            <li className="UserList__container__list__item" onClick={()=>{setOtherUserId(chat)}}>
            <div>
              <img
                src={defaultAvatar}
                className="UserList__container__list__item__avatar"
                alt="avatar"
              />
            </div>
            <div className="UserList__container__list__item__content">
              <p className="UserList__container__list__item__content__name">
              {chat.name}
              </p>
            </div>
            <div className="UserList__container__list__item__time">
              {chat.last_message_at.substring(11, 16)}
            </div>
          </li>
                  ))}

          {/* <li className="UserList__container__list__item UserList__container__list__item--selected">
            <div>
              <img
                src={defaultAvatar}
                className="UserList__container__list__item__avatar"
                alt="avatar"
              />
            </div>
            <div className="UserList__container__list__item__content">
              <p className="UserList__container__list__item__content__name">
                Joe Bloggs
              </p>
              <p className="UserList__container__list__item__content__text">
                Joe: Not bad, how was yours?
              </p>
            </div>
            <div className="UserList__container__list__item__time">9:38 AM</div>
          </li>
          <li className="UserList__container__list__item">
            <div>
              <img
                src={defaultAvatar}
                className="UserList__container__list__item__avatar"
                alt="avatar"
              />
            </div>
            <div className="UserList__container__list__item__content">
              <p className="UserList__container__list__item__content__name">
                Jane Smith
              </p>
              <p className="UserList__container__list__item__content__text">
                Jane: Did you get the files I sent yesterday?
              </p>
            </div>
            <div className="UserList__container__list__item__time">
              Yesterday
            </div>
          </li> */}
        </ul>
      </div>
    </div>
  );
}

export default UserList;

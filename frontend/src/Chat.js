import React from 'react';
import './Chat.css';
import socketClient from "socket.io-client";
import {Chatjs} from './js/Chatjs.js';
import ScrollToBottom from 'react-scroll-to-bottom';
import { css } from '@emotion/css';

const SERVER = "http://localhost:8080/";

const ROOT_CSS = css({
  height: '100%',
  width: '100%'
});

function Chat() {
  Chatjs();
  
  const logout = () =>{
    localStorage.removeItem('token');
    window.location.href = "http://localhost:3000/";
  }
  return (
      <div className="Chat">
        <div className='Table'>
          <div className='chanel category'>
            <h4 className='title'>Channels</h4>
              <div id="channel" className='chanels category'>
              </div>
            <button onClick={logout} className='styledChat logout'>Log out</button>
          </div>
          <div className='chat category'>
            <div id="test">
              <h4 id="nameChannel"></h4>
            </div>
              <div className='print category'>
                <ScrollToBottom className="scrollbar">
                    <div id="chat_content">
                      
                    </div>
                </ScrollToBottom>
              </div>
              <form id="form">
                <input type="text" id="chat_message" name="name" required size="35"/>
                <div>
                  <button className="styledChat" type="submit">SEND MESSAGE</button>
                </div>
                
              </form>
              <div id="params"> 
                  <div id="param"></div>
              </div>
          </div>
          <div className='private category'>
            <h4>Contacts</h4>
            <ScrollToBottom className="scrollbar">
              <div id="contact" className='messages category'>
              </div>
            </ScrollToBottom>
          </div>
        </div>
      </div>
  );
}

export default Chat;


import socketClient from "socket.io-client";
import React from 'react';
import axios from 'axios';
const SERVER = "http://localhost:8080/";

var DomIsLoaded = false;
export function Chatjs(){


    var test;
    window.addEventListener("DOMContentLoaded", function () {

        if(DomIsLoaded == true){
            var socket = socketClient(SERVER, { transports : ['websocket'] });

            socket.on('connect', () => {
                socket.emit('setToken', localStorage.getItem('token'));
            });

            document.getElementById("form").onsubmit = function(){
                if(document.getElementById('chat_message').value != ''){
                    socket.emit('addMessage', document.getElementById('chat_message').value);
                    document.getElementById('chat_message').value = '';
                }
                
                return false;
            };

            socket.on("newMessage", function(message){
                document.getElementById('chat_content').insertAdjacentHTML('beforeend',"<div class='message'>"+message + '</div>');
            });

            socket.on("newPrivateMessage", function(message){
                document.getElementById('chat_content').insertAdjacentHTML('beforeend',"<div class='message' style='color:maroon;'>"+message + '</div>');
            });

            socket.on("onSuccess", function(message){
                document.getElementById('chat_content').insertAdjacentHTML('beforeend',"<div class='message' style='color:#282c34;'>"+message + '</div>');
            });

            socket.on("onErreur", function(message){
                document.getElementById('chat_content').insertAdjacentHTML('beforeend',"<div class='message' style='color:red;'>"+message + '</div>');
            });

            socket.on("setPseudo", (pseudo) => {
                document.getElementById('param').innerHTML=('beforeend',"Login : "+pseudo);
            })

            socket.on("setChannelInfos", (channel) => {
                document.getElementById('nameChannel').innerHTML=('beforeend',channel.name);
                document.getElementById('chat_content').innerHTML=("");
                let users = JSON.parse(channel.users)
                axios.get('http://localhost:8080/api/channel_messages/', {params: {channel_id: channel.id}}).then(res => {
                    if (res.status == 200) {
                        let arr = res.data
                        for (let i = 0; i < arr.length; i++) {
                            for (let j = 0; j < users.length; j++){
                                if (users[j].user_id == arr[i].user_id) {
                                    document.getElementById('chat_content').insertAdjacentHTML('beforeend',"<div class='message'>"+users[j].pseudo+" : "+arr[i].message + '</div>');
                                    break;
                                }
                            }
                        }
                    } else
                        console.log("Something wrong happened while getting channel messages.");
                }).catch(err => {
                    console.log("Something wrong happened while getting channel messages.");
                })
            })

            socket.on('setChannelList', (list) => {
                document.getElementById('channel').innerHTML=("");
                let arr = JSON.parse(list);
                for (let i = 0; i < arr.length; i++){
                    if(arr[i].channel_name == document.getElementById("nameChannel").innerText){
                        document.getElementById('channel').insertAdjacentHTML('beforeend',"<div class='message' style='color:black;'>"+arr[i].channel_name + '</div>');
                    }else{
                        document.getElementById('channel').insertAdjacentHTML('beforeend',"<div class='message'>"+arr[i].channel_name + '</div>');
                    }
                }
            })

            socket.on('setContactList', (list) => {
                document.getElementById('contact').innerHTML=("");
                let contactIdList = list
                axios.get('http://localhost:8080/api/users/').then(res => {
                    if (res.status == 200) {
                        let arr = res.data
                        for (let i = 0; i < arr.length; i++) {
                            if (contactIdList.indexOf(arr[i].user_id) != -1)
                                document.getElementById('contact').insertAdjacentHTML('beforeend',"<div class='contact'>"+arr[i].pseudo + '</div>');
                        }
                    } else
                        console.log("Something wrong happened while getting the users list.");
                }).catch(err => {
                    console.log("Something wrong happened while getting the users list.");
                })
            })

            DomIsLoaded = false;
        }else{
            DomIsLoaded = true;
        }
    });
}
var http = require('http');
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
const axios = require ('axios');
const { channel } = require('diagnostics_channel');

app.use(cors({
    credentials: true
}));
app.use(bodyParser.json());

app.use('/api/users', require("./app/routes/users.routes.js"));
app.use('/api/channels', require("./app/routes/channels.routes.js"));
app.use('/api/user_messages', require("./app/routes/user_messages.routes.js"));
app.use('/api/channel_messages', require("./app/routes/channel_messages.routes.js"));
    
var server = http.createServer(app);
var io = require('socket.io')(server);

var channels = [];

axios.get('http://localhost:8080/api/channels').then(res => {
    for (let channel in res.data) {
        channels.push({
            name: res.data[channel].channel_name,
            participants: 0,
            id: res.data[channel].channel_id,
            sockets: []
        })
    }
}).catch(err => {
    console.log(err.message);
})

io.on('connection',function(socket){
    socket.on('setToken', function(data){
        console.log('user connected');
        channels[0].sockets.push(socket);
        channels[0].participants++;
        socket.user_id = JSON.parse(data);
        axios.get('http://localhost:8080/api/users/' + socket.user_id
        ).then(res => {
            socket.pseudo = res.data.pseudo;
            channels[0].sockets.forEach((sock) => {
                if (sock.pseudo != socket.pseudo)
                    sock.emit('onSuccess', socket.pseudo + ' join the channel')
            })
            socket.emit('setPseudo', socket.pseudo)
            sendContactList(socket)
            sendChannelInfos(socket, channels[0].id, channels[0].name)
            sendChannelList(socket)
        }).catch(err => {
            console.log(err.message);
        })
    });

    socket.on('addMessage', function(data){
        if(data != '' && data){
            var userInsert = data.split(" ");
            var arg = userInsert.slice(1, userInsert.length).join(' ')
            switch(userInsert[0]){
                case "/help":
                    help(socket);
                    break;
                case "/getMsg":
                    getMessagesWith(socket, userInsert[1])
                    break;
                case "/users":
                    users(socket);
                    break;
                case "/nick":
                    nick(socket, userInsert[1]);
                    break;
                case "/msg":
                    msg(socket, userInsert[1],data.substring(userInsert[1].length+6));
                    break;
                case "/list":
                    list(socket, (userInsert[1])?userInsert[1]:null);
                    break;
                case "/quit":
                    quit(socket, false);
                    break;
                case "/join":
                    join(socket, arg);
                    break;
                case "/create":
                    create(socket, arg);
                    break;
                case "/delete":
                    deleteChannel(socket, arg);
                    break;
                default:
                    sendMessage(socket, data)
                    break;
            }
        }
    });

    socket.on('disconnect', function(){
        channels.forEach((channel) => {
            if (channel.sockets.includes(socket)) {
                channel.sockets.splice(channel.sockets.indexOf(socket), 1)
                channel.sockets.forEach((sock) => {
                    sock.emit('onSuccess', socket.pseudo + ' leave the channel')
                })
        }
        })
        console.log('user disconnected');
    });
});

function help(socket) {
    socket.emit('onSuccess', 'List of commands:')
    socket.emit('onSuccess', '-/help: display commands informations')
    socket.emit('onSuccess', '-/nick (nickname): define the nickname of the user (change it for the connexion too).')
    socket.emit('onSuccess', '-/list [string]: list the available channels from the server. If string is specified, only displays those whose name contains the string.')
    socket.emit('onSuccess', '-/create (channel): create a channel with the specified name.')
    socket.emit('onSuccess', '-/delete (channel): delete the channel with the specified name.')
    socket.emit('onSuccess', '-/join (channel): join the specified channel.')
    socket.emit('onSuccess', '-/quit: quit the current channel.')
    socket.emit('onSuccess', '-/users: list the users currently in the channel.')
    socket.emit('onSuccess', '-/msg (nickname) (message): send a private the message to the specified nickname.')
    socket.emit('onSuccess', '-/getMsg (nickname): list all messages exchanged with the specific nickname')
    socket.emit('onSuccess', '(message): send message the all the users on the channel.')
}

function sendChannelInfos(socket, id, name) {
    axios.get('http://localhost:8080/api/users/').then(res => {
        if (res.status == 200) {
            socket.emit('setChannelInfos', {
                id: id,
                name: name,
                users: JSON.stringify(res.data)
            })
        } else
            console.log("Something wrong happened while getting the user list.");
    }).catch(err => {
        console.log("Something wrong happened while getting the user list.");
    })
}

function reloadContactListWhereUser(socket) {
    axios.get('http://localhost:8080/api/user_messages/' + socket.user_id).then(res => {
        let contactIdList = []
        if (res.status == 200) {
            let arr = res.data
            for (let i = 0; i < arr.length; i++) {
                if (socket.user_id == arr[i].from_user_id && contactIdList.indexOf(arr[i].to_user_id) == -1)
                    contactIdList.push(arr[i].to_user_id)
                else if (socket.user_id == arr[i].to_user_id && contactIdList.indexOf(arr[i].from_user_id) == -1)
                    contactIdList.push(arr[i].from_user_id)
            }
            channels.forEach((channel) => {
                channel.sockets.forEach((sock) => {
                    if (contactIdList.indexOf(sock.user_id) != -1)
                        sendContactList(sock)
                })
            })
        } else
            console.log("Something wrong happened while getting messages from a user.");
    }).catch(err => {
        console.log("Something wrong happened while getting messages from a user.");
    })
}

function getMessagesWith(socket, nickname) {
    const params = {
        user_id: socket.user_id,
        nickname: nickname
    }
    axios.get('http://localhost:8080/api/user_messages/between/', {params}).then((res) => {
        if (res.status == 200) {
            if (res.data.length == 0)
                socket.emit('onErreur', 'You nerver exchange with ' + nickname)
            else {
                socket.emit('onSuccess', 'Messages send with ' + nickname + ':')
                let messages = res.data
                for (let i = 0; i < messages.length; i++) {
                    if (messages[i].from_user_id == socket.user_id)
                        socket.emit('newPrivateMessage', " you send to ["+nickname+"] : "+messages[i].message);
                    else
                        socket.emit('newPrivateMessage', "["+nickname+"] send to you : "+messages[i].message);
                }
            }
        } 
    }).catch(err => {
        socket.emit('onErreur', 'You nerver exchange with ' + nickname)
    })
}

function sendChannelList(socket) {
    axios.get('http://localhost:8080/api/channels/').then(res => {
        if (res.status == 200) {
            if (socket == null) {
                channels.forEach((channel) => {
                    channel.sockets.forEach((sock) => {
                        sock.emit('setChannelList', JSON.stringify(res.data));
                    })
                })
            } else {
                socket.emit('setChannelList', JSON.stringify(res.data));
            }
        } else
            console.log("Something wrong happened while getting the channel list.");
    }).catch(err => {
        console.log("Something wrong happened while getting the channel list.");
    })
}

function sendContactList(socket) {
    let contactIdList = []
    axios.get('http://localhost:8080/api/user_messages/' + socket.user_id).then(res => {
        if (res.status == 200) {
            let arr = res.data
            for (let i = 0; i < arr.length; i++) {
                if (socket.user_id == arr[i].from_user_id && contactIdList.indexOf(arr[i].to_user_id) == -1)
                contactIdList.push(arr[i].to_user_id)
                else if (socket.user_id == arr[i].to_user_id && contactIdList.indexOf(arr[i].from_user_id) == -1)
                contactIdList.push(arr[i].from_user_id)
            }
            socket.emit('setContactList', contactIdList)
        } else
            console.log("Something wrong happened while getting the contact list with the messages send.");
    }).catch(err => {
        console.log("Something wrong happened while getting the contact list with the messages send.");
    })
}

function sendMessage(socket, data) {
    channels.forEach(function(channel) {
        if(channel.sockets.includes(socket)) {
            axios.post('http://localhost:8080/api/channel_messages/', {
                    channel_id: channel.id,
                    user_id: socket.user_id,
                    message: data
            }).then(res => {
                if (res.status == 200) {
                    channels.forEach(function(channel) {
                        if(channel.sockets.includes(socket)) {
                            channel.sockets.forEach(function(socketPerChannel) {
                                socketPerChannel.emit('newMessage', socket.pseudo+" : "+data);
                            })
                        }
                    })
                } else
                    socket.emit('onErreur', "Something wrong happened while sending message to the channel.");
            }).catch(err => {
                socket.emit('onErreur', "Something wrong happened while sending message to the channel.");
            })
        }
    })
}

function create(socket, channelName) {
    const params = { channel_name: channelName}
    axios.get('http://localhost:8080/api/channels/', {params}).then(res => {
        if (res.status == 200 && res.data.length == 0) {
            axios.post('http://localhost:8080/api/channels/', {
                channel_name: channelName
            }).then(res => {
                if (res.status == 200) {
                    channels.push({
                        name: res.data.channel_name,
                        participants: 0,
                        id: res.data.channel_id,
                        sockets: []
                    })
                    socket.emit('onSuccess', "Channel succefully created");
                    sendChannelList(null)
                } else
                    socket.emit('onErreur', "Something wrong happened while creating the channel.");
            }).catch(err => {
                socket.emit('onErreur', "Something wrong happened while creating the channel.");
            })
        } else {
            socket.emit('onErreur', "Channel name already use.");
        }
    }).catch(err => {
        socket.emit('onErreur', "Channel not found.");
    })
}

function deleteChannel(socket, channelName){
    const params = { channel_name: channelName}
    axios.get('http://localhost:8080/api/channels/', {params}).then(res => {
        if (res.status == 200) {
            if (res.data[0].channel_id == 1) {
                socket.emit('onErreur', "Can't delete Global Channel");
                return;
            }
            axios.delete('http://localhost:8080/api/channels/' + res.data[0].channel_id).then(res => {
                if (res.status == 200) {
                    channels.forEach(function(channel) {
                        if(channel.name == channelName) {
                            channel.sockets.forEach((sock) => {
                                join(sock, "Global chat")
                                sendChannelList(null)
                            })
                            channels.splice(channels.indexOf(channel), 1);
                            return;
                        }
                    });
                    socket.emit('onSuccess', "Channel succefully deleted");
                } else
                    socket.emit('onErreur', "Something wrong happened while deleting the channel.");
            }).catch(err => {
                socket.emit('onErreur', "Can't delete Global Channel.");
            })
        } else {
            socket.emit('onErreur', "Channel not found.");
        }
    }).catch(err => {
        socket.emit('onErreur', "Channel not found.");
    })
}

function join(socket, nameChannel){
    let find = false;
    channels.forEach(function(channel) {
        if(channel.name == nameChannel) {
            quit(socket, true);
            channel.sockets.forEach((sock) => {
                sock.emit('onSuccess', socket.pseudo + ' join the channel')
            })
            channel.sockets.push(socket);
            channel.participants++;
            sendChannelInfos(socket, channel.id, nameChannel);
            sendChannelList(socket)
            find = true
            return;
        }
    });
    if (!find)
        socket.emit('onErreur', "Channel not found.");
}

function quit(socket, beforeJoin){
    channels.forEach(function(channel){
        if(channel.sockets.includes(socket)){
            if (channel.name == "Global chat" && beforeJoin == false)
                socket.emit('onErreur', "You can't quit the global chat");
            else {
                if (beforeJoin == false)
                    join(socket, "Global chat")
                else {
                    channel.participants--;
                    var index = channel.sockets.indexOf(socket);
                    channel.sockets.splice(index, 1);
                    channel.sockets.forEach((sock) => {
                        sock.emit('onSuccess', socket.pseudo + ' leave the channel')
                    })
                }
            }
        }
    });
}

function list(socket, str){
    var list = "";
    if(str){
        channels.forEach(function(channel){
            if(channel.name.includes(str)){
                list += channel.name+" | ";
            }
        });
    }else{
        channels.forEach(function(channel){
            list += channel.name+" | ";
        });
    }
    socket.emit('onSuccess', "channels list : "+list.slice(0, -3));
}

function msg(socket, userPseudoToSend, msgString){
    let msg_send = false
    channels.forEach(function(channel){
        if(channel.sockets.includes(socket)){
            channel.sockets.forEach(function(socketPerChannel){
                if(socketPerChannel.pseudo == userPseudoToSend){
                    var socketToSend = socketPerChannel;
                    axios.post('http://localhost:8080/api/user_messages', {
                        from_user_id: socket.user_id,
                        to_user_id: socketToSend.user_id,
                        message: msgString
                    }).then(res => {
                        sendContactList(socket)
                        sendContactList(socketToSend)
                        socketToSend.emit('newPrivateMessage', "["+socket.pseudo+"] send to you : "+msgString);
                        socket.emit('newPrivateMessage', " you send to ["+socketToSend.pseudo+"] : "+msgString);
                        send = true
                    }).catch(err => {
                        socket.emit('onErreur', "Can't send message, user isn't online.");
                    })
                }
            });
        }
    });
    if (msg_send == false)
        socket.emit('onErreur', "Can't send message, user isn't online.");
}

function users(socketSend){
    var list = "";
    channels.forEach(function(channel){
        if(channel.sockets.includes(socketSend)){
            channel.sockets.forEach(function(socket){
                list += socket.pseudo+" | ";
            });
        }
    });
    socketSend.emit('onSuccess', "users list : "+list.slice(0, -3));
}

function nick(socket, newPseudo){
    axios.put('http://localhost:8080/api/users/' + socket.user_id, {
        pseudo: newPseudo,
    }).then(res => {
        if (res.status == 200) {
            socket.pseudo = newPseudo;
            socket.emit('onSuccess', "Nickname change to " + newPseudo);
            socket.emit('setPseudo', newPseudo)
            reloadContactListWhereUser(socket)
        } else {
            socket.emit('onErreur', "Nickname already use.");
        }
    }).catch(err => {
        socket.emit('onErreur', "Nickname already use.");
    })
}

server.listen(8080, () => {
    console.log("Listening on localhost:8080")
});
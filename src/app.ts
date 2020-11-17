import express from "express";
import http from "http";
import socketIO from 'socket.io'



const app = express();
const server = http.createServer(app);
// @ts-ignore
const socket = socketIO(server);


app.get('/', (req, res) => {
    res.send("Hello it's WS SERVER")
});


const messages:Array<any> = [];


const usersState = new Map();

socket.on("connection", (socketChannel) => {

    usersState.set(socketChannel, {id: new Date().getTime().toString(), name: 'anonym'});

    socket.on('disconnect', () => {
        usersState.delete(socketChannel)
    });

    socketChannel.on('client-name-sent', (name: string) => {

        if(typeof name !== 'string' || name === '') {
            return;
        }

        const user = usersState.get(socketChannel);
        user.name = name;
    });

    socketChannel.on('client-message-sent', (message: string) => {
        if (typeof message !== 'string') {
            return;
        }

        const user = usersState.get(socketChannel);

        let messageItem = {
            id: new Date().getTime(),
            message: message,
            user: {id: user.id, name: user.name}
        };
        messages.push(messageItem);

        socket.emit('new-message-sent', messageItem);
    });

    socketChannel.emit('init-messages-published', messages);

    console.log("User Connected!");
});


server.listen(3005);

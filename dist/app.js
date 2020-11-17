"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var socket_io_1 = __importDefault(require("socket.io"));
var app = express_1.default();
var server = http_1.default.createServer(app);
var socket = socket_io_1.default(server);
app.get('/', function (req, res) {
    res.send("Hello it's WS SERVER");
});
var messages = [];
var usersState = new Map();
socket.on("connection", function (socketChannel) {
    usersState.set(socketChannel, { id: new Date().getTime().toString(), name: 'anonym' });
    socket.on('disconnect', function () {
        usersState.delete(socketChannel);
    });
    socketChannel.on('client-name-sent', function (name) {
        if (typeof name !== 'string' || name === '') {
            return;
        }
        var user = usersState.get(socketChannel);
        user.name = name;
    });
    socketChannel.on('client-message-sent', function (message) {
        if (typeof message !== 'string') {
            return;
        }
        var user = usersState.get(socketChannel);
        var messageItem = {
            id: new Date().getTime(),
            message: message,
            user: { id: user.id, name: user.name }
        };
        messages.push(messageItem);
        socket.emit('new-message-sent', messageItem);
    });
    socketChannel.emit('init-messages-published', messages);
    console.log("User Connected!");
});
server.listen(3005);
//# sourceMappingURL=app.js.map
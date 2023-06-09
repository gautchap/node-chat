import User from "./User.js";
import Channel from "./Channel.js";

class Chat {
    constructor(io, userList, messageList) {
        this.io = io;
        this.userList = userList;
        this.messageList = messageList;

        this.user = new User(this.io, this.userList);
        this.channel = new Channel(this.io, this.userList, this.messageList);

        this.onConnection = this.onConnection.bind(this);
        this._newMessage = this._newMessage.bind(this);
        this._typingMessage = this._typingMessage.bind(this);
        this._sendList = this._sendList.bind(this);
    }

    onConnection(socket) {
        this.user.onConnection(socket);
        this.channel.onConnection(socket);
        this._sendList();

        socket.on("chat message", this._newMessage);
        socket.on("typing", this._typingMessage);
    }

    _newMessage(arg) {
        const { room } = arg;
        this.messageList[room].push(arg);
        this.io.in(room).emit("chat message", arg);
    }

    _typingMessage(arg) {
        const { room } = arg;
        this.io.in(room).emit("typing", arg);
    }

    _sendList() {
        this.io.emit("messageList", this.messageList);
    }
}

export default Chat;

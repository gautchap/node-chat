import User from "./User.js";

class Channel {
    constructor(io, userList, messageList) {
        this.io = io;
        this.userList = userList;
        this.messageList = messageList;

        this.user = new User(this.io, this.userList);
    }

    onConnection(socket) {
        socket.on("join", (room) => {
            socket.join(room);
        });

        socket.on("leave", (room) => {
            socket.leave(room);
        });

        socket.on("change", (user, room) => {
            this._changeRoom(user, socket, room);
        });
    }

    _changeRoom(user, socket, room) {
        const userIndex = this.userList[room.prev].findIndex((user) => user.id === socket.id);

        if (userIndex !== -1) {
            const userToMove = this.userList[room.prev].splice(userIndex, 1)[0];
            this.user.addUser(userToMove, socket, room.next);
        }

        this.io.emit("messageList", this.messageList);
    }
}

export default Channel;

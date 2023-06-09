class User {
    constructor(io, userList) {
        this.io = io;
        this.userList = userList;
        this.room = null;
    }

    onConnection(socket) {
        socket.on("user", (arg, room) => {
            this.addUser(arg, socket, room);
            this.room = room;
        });

        socket.on("disconnect", () => {
            this._deleteUser(socket);
        });
    }

    addUser(arg, socket, room) {
        const user = { name: arg?.name || arg, id: socket.id, isTyping: false };
        this.userList[room].push(user);
        this.io.emit("userList", this.userList);
    }

    _deleteUser(socket) {
        for (let key of Object.keys(this.userList)) {
            const index = this.userList[key].findIndex((user) => user.id === socket.id);
            if (index !== -1) {
                this.userList[key].splice(index, 1);
            }
        }
        this.io.emit("userList", this.userList);
        socket.disconnect();
    }
}
export default User;

import Chat from "../app/Chat.js";

const userList = {
    Général: [],
    Graphisme: [],
    Développement: [],
};

const messageList = {
    Général: [],
    Graphisme: [],
    Développement: [],
};

export const websocket = (io) => {
    const chat = new Chat(io, userList, messageList);
    io.on("connection", chat.onConnection.bind(chat));
};

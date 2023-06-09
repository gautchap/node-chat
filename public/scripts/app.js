"use strict";

window.dataLayer = window.dataLayer || [];
function gtag() {
    dataLayer.push(arguments);
}
gtag("js", new Date());

gtag("config", "G-CHQWTM9K97");

const userName = prompt("Quel est votre pseudo ?") || "Invité mystère";

const socket = io.connect("/");

const allRooms = document.querySelectorAll(".room");
const myForm = document.getElementById("myForm");
const messages = document.getElementById("listeMsg");
const header = document.getElementById("welcome");
const userList = document.getElementById("userList");
const input = document.getElementById("input");
let isTyping = document.getElementById("isTyping");

new EmojiPicker({
    trigger: [
        {
            selector: ".emoji",
            insertInto: "#input",
        },
    ],
    closeButton: true,
    specialButtons: "darkkhaki",
});

let thisRoom = allRooms[0].textContent;
allRooms[0].classList.add("selected");

function sayHello() {
    let element = document.createElement("p");
    element.innerHTML = `Bonjour <strong>${userName}</strong> !`;
    header.appendChild(element);
}

function changeRoom(event) {
    if (thisRoom === event.target.textContent) return;
    messages.innerHTML = "";
    socket.emit(
        "change",
        { name: userName, id: socket.id, isTyping: false },
        { prev: thisRoom, next: event.target.textContent }
    );
    allRooms.forEach((room) => room.classList.remove("selected"));
    event.target.classList.add("selected");
    socket.emit("leave", thisRoom);
    thisRoom = event.target.textContent;
    socket.emit("join", thisRoom);
}

function showUserList(list) {
    userList.innerHTML = "";
    list.forEach((user) => {
        let element = document.createElement("li");
        element.innerHTML = `<strong class='userName'>${user.name}</strong>`;
        userList.appendChild(element);
    });
}

function showMessageList(list) {
    messages.innerHTML = "";
    list.forEach((message) => {
        let element = document.createElement("li");
        element.innerHTML = `<strong class='userName'>${message.user.name}</strong> : ${message.message} <small>reçu à ${message.date}</small>`;
        messages.appendChild(element);
    });
}

window.addEventListener("DOMContentLoaded", () => {
    socket.on("connect", () => {
        socket.emit("join", thisRoom);
        socket.emit("user", userName, thisRoom);
    });

    sayHello();

    socket.on("chat message", (arg) => {
        let element = document.createElement("li");
        element.innerHTML = `<strong class='userName'>${arg.user.name}</strong> : ${arg.message} <small>reçu à ${arg.date}</small>`;
        messages.appendChild(element);
    });

    socket.on("messageList", (list) => {
        showMessageList(list[thisRoom]);
    });

    socket.on("typing", (arg) => {
        if (arg.isTyping === true) {
            isTyping.classList.add("userName");
            isTyping.innerHTML = `salut`;
            isTyping.innerHTML = `<strong>${arg.user}</strong> est entrain d'écrire ...`;
        } else {
            isTyping.innerHTML = "";
        }
    });

    socket.on("userList", (list) => {
        showUserList(list[thisRoom]);
    });

    myForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (event.target.message.value.trim() == "") return;
        isTyping.innerHTML = "";
        socket.emit("typing", { user: userName, isTyping: false, room: thisRoom });

        let date = new Date();
        date.toLocaleString("fr-FR", { timeZone: "Europe/Paris" });

        const hours = (date.getHours() < 10 ? "0" : "") + date.getHours();
        const mins = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();

        socket.emit("chat message", {
            user: { name: userName, id: socket.id },
            message: event.target.message.value,
            room: thisRoom,
            date: `${hours}:${mins}`,
        });
        event.target.message.value = "";
    });

    input.addEventListener("input", (event) => {
        if (event.target.value.trim() == "") {
            return (
                socket.emit("typing", { user: userName, isTyping: false, room: thisRoom }), (isTyping.innerHTML = "")
            );
        }

        socket.emit("typing", { user: userName, isTyping: true, room: thisRoom });
    });

    allRooms.forEach((room) => room.addEventListener("click", changeRoom));
});

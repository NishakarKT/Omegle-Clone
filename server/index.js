import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let users = [];
const addUser = (id) => users.push({ id, activeStatus: false, mode: "" });
const getUser = (id) => users.find(user => user.id === id);
const findStranger = (id, mode) => users.find(user => user.id !== id && user.mode === mode && user.activeStatus);
const deleteUser = (id) => { users = users.filter(user => user.id !== id); };

io.on("connect", socket => {
    console.log("New User : " + socket.id);

    socket.on("onJoin", () => { addUser(socket.id); });

    socket.on("findStranger", mode => {
        const user = getUser(socket.id);
        const index = users.indexOf(user);

        if (user) {
            users[index].activeStatus = true;
            users[index].mode = mode;
        };

        const foundUser = findStranger(socket.id, mode);
        const foundIndex = users.indexOf(foundUser);

        if (user && foundUser) {
            socket.emit("foundStranger", foundUser.id);
            socket.emit("videoConnect", foundUser.id);
            io.to(foundUser.id).emit("foundStranger", socket.id);
            users[index].activeStatus = false;
            users[foundIndex].activeStatus = false;
        }
    });

    socket.on("sendMessage", ({ message, friendId }) => {
        message["sent"] = false;
        io.to(friendId).emit("sentMessage", message);
    });

    socket.on("videoConnect", ({ friendId, signal }) => {
        io.to(friendId).emit("videoConnected", { friendId: socket.id, signal });
    });

    socket.on("videoConnectionSuccess", ({ friendId, signal }) => {
        io.to(friendId).emit("videoConnectionSuccess", signal);
    });

    socket.on("isTyping", friendId => { io.to(friendId).emit("isTyping"); });

    socket.on("end", friendId => { io.to(friendId).emit("end"); });

    socket.on("getTotalActiveUsers", () => { socket.emit("totalActiveUsers", users.length); });

    socket.on("disconnect", () => { deleteUser(socket.id); });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log("Listening to PORT : " + PORT));
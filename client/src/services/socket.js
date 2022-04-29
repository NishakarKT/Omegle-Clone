import { io } from "socket.io-client";

const ENDPOINT = "http://localhost:8000";
const socket = io(ENDPOINT);

socket.emit("onJoin");

export default socket;
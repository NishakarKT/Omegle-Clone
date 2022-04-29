import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Peer from "simple-peer";
import "./Chat.css";
// services
import socket from "../../services/socket";
// constants
import { SEARCHING } from "../../constants/images";
import { T_CHAT, V_CHAT } from "../../constants/routes";
// components
import Message from "../../components/message/Message";
// material-ui
import { Button } from "@material-ui/core";

const Chat = ({ location }) => {
    let key = 0;
    const { mode } = useParams();
    const [friendId, setFriendId] = useState("");
    const [onChat, setOnChat] = useState(false);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [stream, setStream] = useState(null);
    const myVideo = useRef();
    const friendVideo = useRef();
    const connection = useRef();

    useEffect(() => {
        window.scroll({ top: 0, behavior: "smooth" });

        socket.on("foundStranger", friendId => {
            setMessages([]);
            setOnChat(true);
            setFriendId(friendId);
        });

        socket.on("sentMessage", message => {
            setIsTyping(false);
            setMessages(messages => [...messages, message]);
            document.querySelector(".chat__messagesBox").scrollTop = document.querySelector(".chat__messagesBox").scrollHeight - document.querySelector(".chat__messagesBox").clientHeight;
            setText("");
        });

        socket.on("isTyping", () => {
            responseToIsTyping();
        });

        socket.on("end", () => {
            setOnChat(false);
        });

        if (mode === "v") videoSetup();
        else if (stream)
            stream.getTracks().forEach(function (track) { track.stop(); });

        // findStranger();
    }, [location]);

    const findStranger = () => {
        let searches = 0;
        const searchLimit = 30;
        setMessages([]);
        setIsSearching(true);
        // find a stranger
        const findStranger = setInterval(() => {
            if (++searches === searchLimit) {
                clearInterval(findStranger);
                alert("No active users found, try again after sometime.");
                setIsSearching(false);
            }
            socket.emit("findStranger", mode);
        }, [1000]);
        // found a stranger
        socket.on("foundStranger", friendId => {
            setOnChat(true);
            setIsSearching(false);
            clearInterval(findStranger);
            setFriendId(friendId);
        });
    };

    const videoSetup = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(stream)
        myVideo.current.srcObject = stream;

        socket.on("videoConnect", friendId => {
            const peer = new Peer({ initiator: true, trickle: false, stream });
            peer.on("signal", signal => {
                socket.emit("videoConnect", { friendId, signal });
            });
            socket.on("videoConnectionSuccess", signal => {
                peer.signal(signal);
            });
            peer.on("stream", stream => {
                friendVideo.current.srcObject = stream;
            })
            connection.current = peer;
        });

        socket.on("videoConnected", ({ friendId, signal }) => {
            const peer = new Peer({ initiator: false, trickle: false, stream });

            peer.signal(signal);

            peer.on("signal", signal => {
                socket.emit("videoConnectionSuccess", { friendId, signal });
            });

            peer.on("stream", stream => {
                friendVideo.current.srcObject = stream;
            })
            connection.current = peer;
        });
    };

    const handleEnterKey = (e) => {
        if (e.charCode === 13) {
            e.preventDefault();
            sendMessage();
        }
    };

    const activateIsTyping = (e) => {
        socket.emit("isTyping", friendId);
        setText(e.target.value);
    };

    const responseToIsTyping = () => {
        if (!isTyping) {
            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
            }, 2000);
        }
    };

    const sendMessage = () => {
        if (text) {
            const message = { sent: true, text };
            setMessages(messages => [...messages, message]);
            socket.emit("sendMessage", { message, friendId });
            document.querySelector(".chat__messagesBox").scrollTop = document.querySelector(".chat__messagesBox").scrollHeight - document.querySelector(".chat__messagesBox").clientHeight;
            setText("");
        }
    };

    const disconnect = () => {
        setOnChat(false);
        setText("");
        document.querySelector(".chat__messagesBox").scrollTop = document.querySelector(".chat__messagesBox").scrollHeight - document.querySelector(".chat__messagesBox").clientHeight;
        setText("");
        socket.emit("end", friendId);
        try {
            connection.current.destroy();
            friendVideo.current = null;
        } catch (err) { console.log(err); };
    };

    return (
        <div className="chat">
            {mode === "v" ? <div className="chat__videos">
                {onChat ? <video ref={friendVideo} playsInline autoPlay /> : null}
                <video ref={myVideo} playsInline autoPlay muted />
            </div> : null}
            <div className="chat__messages">
                {isSearching ? <p>Connecting to server...<img src={SEARCHING} alt="" /></p> : null}
                {onChat ? <p>You're now chatting with a random stranger.</p> : null}
                <div className="chat__messagesBox">
                    {messages.map(message => <Message key={key++} sent={message.sent} text={message.text} />)}
                    {isTyping ? <p>Stranger is typing...</p> : null}
                    {!onChat && !isSearching ? <div className="chat__optionsBox">
                        <p>Stranger has disconnected.</p>
                        <div className="chat__options">
                            <div className="chat__newBtn"><Button onClick={() => findStranger()}>New Chat</Button></div>
                            <p>or</p>
                            <Link to={mode === "t" ? V_CHAT : T_CHAT} className="chat__link">{mode === "t" ? "turn on video" : "turn on text"}</Link>
                        </div>
                    </div> : null}
                </div>
                <div className="chat__foot">
                    <div className={!onChat ? "chat__footNewBtn" : "chat__controlBtn"}>
                        <Button onClick={() => !onChat ? findStranger() : disconnect()}>
                            {!onChat ? "New Chat" : "Stop"}
                        </Button>
                    </div>
                    <textarea
                        value={text}
                        disabled={!onChat}
                        onChange={(e) => activateIsTyping(e)}
                        onKeyPress={(e) => handleEnterKey(e)}
                    />
                    <div className="chat__controlBtn">
                        <Button onClick={() => sendMessage()} disabled={!onChat}>Send</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;

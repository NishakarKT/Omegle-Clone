import React from "react";
import "./Message.css";

const Message = ({ sent, text }) => {
    return (
        <div className={`message ${sent ? "message__myText" : ""}`}>
            <h1>{sent ? "You" : "Stranger"}:</h1>
            <h2>{text}</h2>
        </div>
    );
};

export default Message;

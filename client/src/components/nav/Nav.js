import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Nav.css";
// services
import socket from "../../services/socket";
// constants
import { MAIN } from "../../constants/routes";
import { TITLE } from "../../constants/images";

const Nav = () => {
    const [totalActiveUsers, setTotalActiveUsers] = useState(0);

    useEffect(() => {
        // get total active users
        socket.emit("getTotalActiveUsers");
        socket.on("totalActiveUsers", totalActiveUsers => setTotalActiveUsers(totalActiveUsers));
        setInterval(() => {
            socket.emit("getTotalActiveUsers");
        }, 10000);
    }, []);

    return (
        <div className="nav">
            <Link to={MAIN} className="nav__linkImg"><img src={TITLE} alt="Omegle" /></Link>
            <p>Talk to strangers!</p>
            <h2><b>{totalActiveUsers}</b> online now</h2>
        </div>
    );
};

export default Nav;

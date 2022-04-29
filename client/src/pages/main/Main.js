import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Main.css";
// constants
import { T_CHAT, V_CHAT, CONTROLS, TERMS, GUIDELINES } from "../../constants/routes";
import { MAIN_IMG } from "../../constants/images";
// material-ui
import ErrorRoundedIcon from "@material-ui/icons/ErrorRounded";

const Main = () => {

    useEffect(() => {
        window.scroll({ top: 0, behavior: "smooth" });
    }, [])

    return (
        <div className="main">
            <div className="main__box">
                <h1>You don't need an app to use Omegle on your phone or tablet! The web site works great on mobile.</h1>
                <div className="main__firstPara">
                    <p>Omegle (oh·meg·ull) is a great way to meet new friends, even while practicing social distancing. When you use Omegle, you are paired randomly with another person to talk one-on-one. If you prefer, you can add your interests and you’ll be randomly paired with someone who selected some of the same interests.</p>
                    <img src={MAIN_IMG} alt="" />
                </div>
                <p>To help you stay safe, chats are anonymous unless you tell someone who you are (not recommended!), and you can stop a chat at any time. See our <a href={TERMS} target="_blank" rel="noreferrer">Terms of Service</a> and <a href={GUIDELINES} target="_blank" rel="noreferrer">Community Guidelines</a> for more info about the do’s and don’ts in using Omegle. Omegle video chat is moderated but no moderation is perfect. Users are solely responsible for their behavior while using Omegle.</p>
                <p><b>You must be 18+ or 13+ with parental permission and supervision to use Omegle.</b> See Omegle’s <a href={TERMS} target="_blank" rel="noreferrer">Terms of Service</a> for more info. Parental control protections that may assist parents are commercially available and you can find more info at <a href={CONTROLS} target="_blank" rel="noreferrer">https://www.connectsafely.org/controls/</a> as well as other sites.</p>
                <p>Please leave Omegle and visit an adult site instead if that's what you're looking for, and you are 18 or older.</p>
                <div className="main__alert">
                    <p>Video is monitored. Keep it clean.</p>
                    <ErrorRoundedIcon />
                </div>
                <div className="main__chat">
                    <p>Start chatting:</p>
                    <div className="main__chatBtns">
                        <Link className="main__link" to={T_CHAT}>Text</Link>
                        <p>or</p>
                        <Link className="main__link" to={V_CHAT}>Video</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;

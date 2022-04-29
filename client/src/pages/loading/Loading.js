import React from "react";
import "./Loading.css";
// material-ui
import { CircularProgress } from "@material-ui/core";

const Loading = () => {
    return (
        <div className="loading">
            <CircularProgress />
        </div>
    );
};

export default Loading;

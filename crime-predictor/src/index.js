import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./App.css";
import 'mapbox-gl/dist/mapbox-gl.css'; // Add this line

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);

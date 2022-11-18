import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { GlobalStateProvider } from "./states";
import { SocketProvider } from "./socket";
import { NavigateProvider } from "./lib/utility/Navigate";
import AudioPlayer from "./lib/utility/AudioPlayer";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <BrowserRouter>
        <AudioPlayer />
        <GlobalStateProvider>
            <SocketProvider>
                <NavigateProvider>
                    <App />
                </NavigateProvider>
            </SocketProvider>
        </GlobalStateProvider>
    </BrowserRouter>
);

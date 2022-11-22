import React from "react";
import ActiveUsers from "../components/ActiveUsers";
import Chat from "../components/Chat";
import RequestReceiver from "../components/RequestReceiver";
import ReplyReceiver from "../components/ReplyReceiver";
import MatchingButton from "../components/MatchingButton";
import SocketID from "../components/SocketID";
import HowToPlay from "../components/HowToPlay";
import { NavigateContext } from "../lib/utility/Navigate";
import { SocketContext } from "../socket";

export default function Menu() {
    const { socket } = React.useContext(SocketContext);
    const { navigate } = React.useContext(NavigateContext);
    console.log(socket);
    React.useEffect(() => {
        if (socket) {
            socket.on("go to names", () => {
                navigate("root");
            });
        }
    }, [socket]);

import ExtraButtons from "../components/ExtraButtons";

export default function Menu() {
    return (
        <div
            className="flex flex-col h-screen overflow-hidden text-center font-quicksand
        bg-gradient-to-t from-transparent to-slate-700"
        >
            <div
                className="absolute top-0 botom-0 left-0 right-0 -z-10 bg-cover bg-center blur-sm
            bg-[url('../public/assets/images/bg.gif')] flex-1 h-screen opacity-50"
            />
            <RequestReceiver />
            <ReplyReceiver />
            <HowToPlay />
            <ExtraButtons />
            <div className="text-5xl font-righteous text-white drop-shadow-[5px_5px_0px_rgba(30,30,30,1)] pt-5">
                FIND MY MINES
            </div>
            <div className="flex-1 flex justify-evenly p-1 pt-0">
                <div className="basis-[40%] h-[70vh]">
                    <div className="text-3xl font-quicksand text-white w-full text-center mb-2">
                        ONLINE USERS
                    </div>
                    <div
                        className="flex flex-col h-full justify-evenly shadow-md
                    bg-zinc-600 bg-opacity-80 p-5 rounded-3xl"
                    >
                        <ActiveUsers />
                        <div className="flex py-2">
                            <MatchingButton />
                        </div>
                    </div>
                </div>
                <div className="basis-[40%] h-[70vh]">
                    <div className="text-3xl font-quicksand text-white w-full text-center mb-2">
                        CHAT
                    </div>
                    <div className="h-full bg-zinc-600 bg-opacity-80 p-5 rounded-3xl shadow-md">
                        <Chat mode="global" />
                    </div>
                </div>
            </div>
            <SocketID />
        </div>
    );
}

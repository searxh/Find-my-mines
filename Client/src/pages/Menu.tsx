import React from "react";
import ActiveUsers from "../components/ActiveUsers";
import Chat from "../components/Chat";
import RequestReceiver from "../components/RequestReceiver";
import ReplyReceiver from "../components/ReplyReceiver";
import MatchingButton from "../components/MatchingButton";
import SocketID from "../components/SocketID";
import HowToPlay from "../components/HowToPlay";
import { NavigateContext } from "../lib/utility/Navigate";

export default function Menu() {
    const { navigate } = React.useContext(NavigateContext);
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
            <button
                onClick={() => navigate("root")}
                className="absolute w-11 h-11 top-2 right-3 hover:scale-110 opacity-70 z-30 transition"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512"
                    className="fill-white"
                >
                    <path d="M320 32c0-9.9-4.5-19.2-12.3-25.2S289.8-1.4 280.2 1l-179.9 45C79 51.3 64 70.5 64 92.5V448H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H96 288h32V480 32zM256 256c0 17.7-10.7 32-24 32s-24-14.3-24-32s10.7-32 24-32s24 14.3 24 32zm96-128h96V480v32h32 64c17.7 0 32-14.3 32-32s-14.3-32-32-32H512V128c0-35.3-28.7-64-64-64H352v64z" />
                </svg>
            </button>
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
                        <Chat />
                    </div>
                </div>
            </div>
            <SocketID />
        </div>
    );
}

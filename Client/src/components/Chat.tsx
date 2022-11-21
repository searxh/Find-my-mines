import React from "react";
import ChatInput from "./ChatInput";
import { GlobalContext } from "../states";
import { MessageType } from "../types";
import { SocketContext } from "../socket";
import AutoScroll from "@brianmcallister/react-auto-scroll";
import { getUserColor } from "../lib/utility/GetUserColor";
import format from "date-fns/format";

export default function Chat({ mode }: { mode: string }) {
    const { global_state } = React.useContext(GlobalContext);
    const { name, gameInfo, activeUsers } = global_state;
    const { socket } = React.useContext(SocketContext);
    const [chat, setChat] = React.useState<Array<MessageType>>([]);
    const [chatHeight, setChatHeight] = React.useState<number>(0);
    const chatWindowRef = React.useRef<HTMLDivElement>(null);
    const chatHeightHandler = () => {
        if (chatWindowRef.current !== null) {
            setChatHeight(chatWindowRef.current.clientHeight);
        }
    };
    React.useLayoutEffect(() => {
        chatHeightHandler();
        window.addEventListener("resize", chatHeightHandler);
        return () => window.removeEventListener("resize", chatHeightHandler);
    }, []);
    React.useEffect(() => {
        if (socket !== undefined) {
            socket.emit("chat request", {
                name: name,
                roomID: gameInfo.roomID,
            });
            socket.on(
                "chat update",
                (chat: { [key: string]: Array<MessageType> }) => {
                    console.log(chat);
                    if (mode === "local" && chat.local !== undefined) {
                        setChat(chat.local);
                    } else if (mode === "global" && chat.global !== undefined) {
                        setChat(chat.global);
                    } else {
                        setTimeout(
                            () =>
                                socket.emit("chat request", {
                                    name: name,
                                    roomID: gameInfo.roomID,
                                }),
                            100
                        );
                    }
                }
            );
            return () => socket.off("chat update") as any;
        }
    }, [socket, gameInfo.roomID, activeUsers]);
    return (
        <div className={`relative font-quicksand text-xl h-full`}>
            <div className="absolute flex flex-col top-0 bottom-0 left-0 right-0 m-auto flex-1">
                <div
                    ref={chatWindowRef}
                    className="basis-[95%] bg-neutral-800 rounded-3xl mb-5 shadow-md"
                >
                    <AutoScroll height={chatHeight} showOption={false}>
                        {chat.map((msg: MessageType, index: number) => {
                            return (
                                <div
                                    key={index}
                                    className="flex justify-between px-5 py-1 text-neutral-400"
                                    style={{
                                        color: getUserColor(
                                            activeUsers,
                                            msg.from
                                        ),
                                    }}
                                >
                                    <div className="text-left brightness-125">
                                        {msg.from.toUpperCase()}:
                                    </div>
                                    <div className="flex-1 px-3 break-words overflow-hidden">
                                        <div className="m-auto text-left">
                                            {msg.message}
                                        </div>
                                    </div>
                                    <div className="text-green-300">
                                        {format(new Date(msg.at), "HH:mm")}
                                    </div>
                                </div>
                            );
                        })}
                        {chat.length === 0 ? (
                            <div className="px-5 py-1"> </div>
                        ) : null}
                    </AutoScroll>
                </div>
                <div className="basis-[5%]">
                    <ChatInput />
                </div>
            </div>
        </div>
    );
}

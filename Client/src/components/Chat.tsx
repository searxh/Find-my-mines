import React from 'react';
import ChatInput from './ChatInput';
import { GlobalContext } from '../states';
import { MessageType, UserType } from '../types';
import { SocketContext } from '../socket';
import AutoScroll from '@brianmcallister/react-auto-scroll';
import { getUserColor } from '../lib/utility/GetUserColor';
import format from 'date-fns/format';

export default function Chat() {
    const { global_state } = React.useContext(GlobalContext);
    const { 
        chatHistory, 
        name, 
        gameInfo,
        activeUsers,
        flags,
    } = global_state;
    const { socket } = React.useContext(SocketContext);
    const [ chatHeight, setChatHeight ] = React.useState<number>(0);
    const chatWindowRef = React.useRef<HTMLDivElement>(null);
    const chatHeightHandler = () => {
        if (chatWindowRef.current !== null) {
            setChatHeight(chatWindowRef.current.clientHeight);
        }
    }
    React.useLayoutEffect(()=>{
        chatHeightHandler();
        window.addEventListener('resize',chatHeightHandler);
        return ()=>window.removeEventListener('resize',chatHeightHandler);
    },[])
    React.useEffect(()=>{
        if (socket !== undefined && flags.activeUsersInitialized) {
            const res = activeUsers.find((user:UserType)=>user.name===name)
            if (res?.inGame && gameInfo !== undefined) {
                socket.emit("chat request",{ 
                    name:name, 
                    roomID:gameInfo.roomID
                });
            } else {
                socket.emit("chat request",{ 
                    name:name, 
                    roomID:undefined
                });
            }
            return ()=>socket.off("chat request") as any;
        }
    },[socket,flags.activeUsersInitialized, gameInfo, activeUsers])
    return (
        <div 
            className={`flex flex-col justify-evenly font-quicksand text-xl h-full`}
        >
            <div
                ref={chatWindowRef}
                className="basis-[95%] bg-neutral-800 rounded-3xl mb-5 shadow-md overflow-hidden"
            >
                <AutoScroll
                    height={chatHeight}
                    showOption={false}
                >
                    {chatHistory.map((msg:MessageType,index:number)=>{
                        return (
                            <div 
                                key={index}
                                className="flex justify-between px-5 py-1 text-neutral-400"
                                style={{
                                    color:getUserColor(activeUsers,msg.from)
                                }}
                            >
                                <div className="flex brightness-125">
                                    <div className="">{msg.from.toUpperCase()}:</div>
                                    <div className="ml-3">
                                        {msg.message}
                                    </div>
                                </div>
                                <div className="text-green-300">
                                    {format(new Date(msg.at),'HH:mm')}
                                </div>
                            </div>
                        )
                    })}
                    {chatHistory.length===0?<div className="px-5 py-1"> </div>:null}
                </AutoScroll>
            </div>
            <div className="basis-[5%]">
                <ChatInput />
            </div>
        </div>
    )
}

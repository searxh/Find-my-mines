import React from 'react'
import ChatInput from './ChatInput'
import { GlobalContext } from '../states'
import { MessageType } from '../types'
import { SocketContext } from '../socket'

export default function Chat() {
    const { global_state } = React.useContext(GlobalContext)
    const { chatHistory } = global_state
    const { socket } = React.useContext(SocketContext)
    React.useEffect(()=>{
        if (socket !== undefined) {
            socket.emit('chat request')
        }
    },[])
    return (
        <div className="flex flex-col justify-evenly font-quicksand text-white text-xl h-full">
            <div className="bg-neutral-800 rounded-lg mb-5 overflow-y-scroll shadow-md">
                {chatHistory.map((msg:MessageType,index:number)=>{
                    return (
                        <div 
                            key={index}
                            className="flex justify-between px-5 py-1"
                        >
                            <div className="flex">
                                <div>{msg.from}:</div>
                                <div className="ml-3">
                                    {msg.message}
                                </div>
                            </div>
                            <div className="text-green-300">{new Date(msg.at).toLocaleTimeString()}</div>
                        </div>
                    )
                })}
            </div>
            <ChatInput />
        </div>
    )
}

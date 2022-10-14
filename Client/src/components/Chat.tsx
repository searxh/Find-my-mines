import React from 'react'
import ChatInput from './ChatInput'
import { GlobalContext } from '../states'
import { MessageType } from '../types'

export default function Chat() {
    const { global_state } = React.useContext(GlobalContext)
    React.useEffect(()=>{
        global_state['socket'].emit('chat request')
    },[])
    return (
        <div className="flex flex-col">
            {global_state['chatHistory'].map((msg:MessageType,index:number)=>{
                return (
                    <div 
                        key={index}
                        className="flex justify-between bg-white p-1"
                    >
                        <div className="flex">
                            <div>From: {msg.from}</div>
                            <div className="text-blue-700 ml-5">
                                {msg.message}
                            </div>
                        </div>
                        <div className="text-green-700">At: {new Date(msg.at).toLocaleTimeString()}</div>
                    </div>
                )
            })}
            <ChatInput />
        </div>
    )
}

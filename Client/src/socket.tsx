import React, { useState, createContext } from "react"
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { GlobalContext } from "./states";
import { GameInfoType, MessageType, UserType } from "./types"

export const SocketContext = createContext<any>({})

export const SocketProvider = ({ children }:{ children:React.ReactNode }) => {
    const { dispatch } = React.useContext(GlobalContext)
    const [ socket, setSocket ] = useState<Socket | undefined>(undefined);
    const navigate = useNavigate()
    React.useEffect(()=>{
        if (socket !== undefined) {
            socket.on('connect',()=>{
                dispatch({ type:'set', field:'connected', payload:socket.connected })
            })
            socket.on('chat update',(chat:MessageType)=>{
                dispatch({ type:'set', field:'chatHistory', payload:chat })
            })
            socket.on('active user update',(activeUsers:Array<UserType>)=>{
                console.log(activeUsers)
                dispatch({ type:'set', field:'activeUsers', payload:activeUsers })
            })
            socket.on('start game',(gameInfo:GameInfoType)=>{
                dispatch({ 
                    type:'multi-set', 
                    field:['gameInfo', 'resultVisible'],
                    payload:[gameInfo,false]
                })
                setTimeout(()=>navigate('/game'),1000)
            })
            socket.on('gameInfo update',(gameInfo:GameInfoType)=>{
                dispatch({ type:'set', field:'gameInfo', payload:gameInfo })
            })
            socket.on('counter',(timer:number)=>{
                dispatch({ type:'timer', payload:timer })
            })
            socket.on('end game',(gameInfo:GameInfoType)=>{
                dispatch({ 
                    type:'multi-set',
                    field:['gameInfo','resultVisible'], 
                    payload:[gameInfo,true]
                })
            })
        }
    },[])
    return (
        <SocketContext.Provider value={{ socket:socket, setSocket:setSocket }}>
            {children}
        </SocketContext.Provider>
    )
}
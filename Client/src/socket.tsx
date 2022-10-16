import React, { createContext } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { GlobalContext } from "./states";
import { GameInfoType, MessageType, UserType, SocketContextType, FlagsType } from "./types"
import { io } from "socket.io-client"

export const SocketContext = createContext<SocketContextType>({} as SocketContextType)

export const SocketProvider = ({ children }:{ children:React.ReactNode }) => {
    const { global_state, dispatch } = React.useContext(GlobalContext)
    const { gameInfo, name, flags } = global_state
    const [ socket, setSocket ] = React.useState<Socket | undefined>(undefined)
    const [ reconnectInGame, setReconnectInGame ] = React.useState<boolean>(false)
    const navigate = useNavigate()
    const location = useLocation()
    React.useEffect(()=>{
        if (socket !== undefined) {
            socket.on('connect',()=>{
                dispatch({ 
                    type:'set', 
                    field:'connected', 
                    payload:socket.connected
                })
                socket.emit("name register",{
                    name:name,
                    id:socket.id,
                })
            })
            socket.on('chat update',(chat:MessageType)=>{
                dispatch({ 
                    type:'set', 
                    field:'chatHistory', 
                    payload:chat
                })
            })
            socket.on('active user update',(activeUsers:Array<UserType>)=>{
                dispatch({ 
                    type:'set', 
                    field:'activeUsers', 
                    payload:activeUsers
                })
            })
            socket.on('start game',(gameInfo:GameInfoType)=>{
                const newFlags = { ...flags, resultVisible:false }
                dispatch({ 
                    type:'multi-set',
                    field:['gameInfo', 'flags'],
                    payload:[gameInfo,newFlags]
                })
                setTimeout(()=>navigate('/game'),1000)
            })
            socket.on('gameInfo update',(gameInfo:GameInfoType)=>{
                dispatch({ 
                    type:'set', 
                    field:'gameInfo', 
                    payload:gameInfo
                })
            })
            socket.on('counter',(timer:number)=>{
                dispatch({ 
                    type:'timer', 
                    payload:timer
                })
            })
            socket.on('end game',(gameInfo:GameInfoType)=>{
                const newFlags = { ...flags, resultVisible:true }
                dispatch({ 
                    type:'multi-set',
                    field:['gameInfo','flags'], 
                    payload:[gameInfo,newFlags]
                })
            })
            socket.on('other user left',()=>{
                const newFlags = { resultVisible:true, setRematchStatus:true }
                dispatch({
                    type:'set',
                    field:'flags',
                    payload:newFlags
                })
            })
        } else {
            if (location.pathname.includes("game")) {
                setSocket(io("http://"+process.env.REACT_APP_IP+":9000"))
                setReconnectInGame(true)
            } else if (location.pathname.includes("menu")) {
                setSocket(io("http://"+process.env.REACT_APP_IP+":9000"))
            }
        }
    },[socket])
    React.useEffect(()=>{
        if (reconnectInGame && socket!== undefined) {
            socket.emit("reconnect game", { roomID:gameInfo.roomID })
            setReconnectInGame(false)
        }
    },[reconnectInGame])
    return (
        <SocketContext.Provider value={{ socket:socket , setSocket:setSocket } as SocketContextType}>
            {children}
        </SocketContext.Provider>
    )
}
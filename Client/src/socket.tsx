import React, { createContext } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { GlobalContext } from "./states";
import { GameInfoType, MessageType, UserType } from "./types"
import { io } from "socket.io-client";

export const SocketContext = createContext<any>({})

export const SocketProvider = ({ children }:{ children:React.ReactNode }) => {
    const { global_state, dispatch } = React.useContext(GlobalContext)
    const { gameInfo, name } = global_state
    const [ socket, setSocket ] = React.useState<Socket | undefined>(undefined)
    const [ reconnectInGame, setReconnectInGame ] = React.useState<boolean>(false)
    const navigate = useNavigate()
    const location = useLocation()
    React.useEffect(()=>{
        if (socket !== undefined) {
            socket.on('connect',()=>{
                dispatch({ type:'set', field:'connected', payload:socket.connected })
                const user:UserType = {
                    name:global_state.name,
                    id:socket.id,
                }
                socket.emit("name register",user)
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
            socket.emit("reconnect game", { roomID:gameInfo.roomID, name:name })
        }
    },[reconnectInGame])
    return (
        <SocketContext.Provider value={{ socket:socket, setSocket:setSocket }}>
            {children}
        </SocketContext.Provider>
    )
}
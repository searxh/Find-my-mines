import React from "react"
import { io } from "socket.io-client"
import { createContext } from "react"
import { useNavigate } from "react-router-dom"
import { ActionType, GameInfoType, GlobalStateType, MessageType, UserType } from "./types"

export const GlobalContext = createContext<any>({})

export const initialState:GlobalStateType = {
    name:"",
    socket:undefined,
    chatHistory:[],
    activeUsers:[],
    gameInfo:{} as GameInfoType,
    resultVisible:false,
}

export function GlobalStateProvider({ children }:{ children:React.ReactNode }) {
    const navigate = useNavigate()
    const reducer = (state:GlobalStateType, action:ActionType) => {
        const newState = { ...state }
        switch (action.type) {
            case "set":
                if (action.field !== undefined) {
                    newState[action.field as string] = action.payload
                    return newState
                } else return state
            case "multi-set":
                if (action.field !== undefined) {
                    for (let i = 0; i < action.field.length; i++) {
                        newState[action.field[i]] = action.payload[i]
                    }
                    return newState
                } else return state
            case "timer":
                newState.gameInfo = { ...newState.gameInfo, timer:action.payload }
                return newState
            default:
                return state
        }
    }
    const [ state, dispatch ] = React.useReducer(reducer, initialState);
    React.useEffect(()=>{
        if (state['socket'] !== undefined) {
            state['socket'].on('chat update',(chat:MessageType)=>{
                dispatch({ type:'set', field:'chatHistory', payload:chat })
            })
            state['socket'].on('active user update',(activeUsers:Array<UserType>)=>{
                dispatch({ type:'set', field:'activeUsers', payload:activeUsers })
            })
            state['socket'].on('start game',(gameInfo:GameInfoType)=>{
                dispatch({ 
                    type:'multi-set', 
                    field:['gameInfo', 'resultVisible'],
                    payload:[gameInfo,false]
                })
                setTimeout(()=>navigate('/game'),1000)
            })
            state['socket'].on('gameInfo update',(gameInfo:GameInfoType)=>{
                dispatch({ type:'set', field:'gameInfo', payload:gameInfo })
            })
            state['socket'].on('counter',(timer:number)=>{
                dispatch({ type:'timer', payload:timer })
            })
            state['socket'].on('end game',(gameInfo:GameInfoType)=>{
                dispatch({ 
                    type:'multi-set',
                    field:['gameInfo','resultVisible'], 
                    payload:[gameInfo,true]
                })
            })
        }
    },[])
    return (
        <GlobalContext.Provider value={{ global_state:state, dispatch:dispatch }}>
            {children}
        </GlobalContext.Provider>
    )
}
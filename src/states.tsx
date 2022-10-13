import React from "react"
import { io } from "socket.io-client"
import { createContext } from "react"
import { useNavigate } from "react-router-dom"
import { ActionType, GlobalStateType } from "./types"

export const GlobalContext = createContext<any>({})

export const initialState:GlobalStateType = {
    name:"",
    socket:io("http://"+process.env.REACT_APP_IP+":9000"),
    chatHistory:[],
    activeUsers:[],
    gameInfo:{},
    resultVisible:false,
}

export function GlobalStateProvider({ children }:any) {
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
        state['socket'].on('chat update',(chat:any)=>{
            dispatch({ type:'set', field:'chatHistory', payload:chat })
        })
        state['socket'].on('active user update',(activeUsers:any)=>{
            dispatch({ type:'set', field:'activeUsers', payload:activeUsers })
        })
        state['socket'].on('start game',(gameInfo:any)=>{
            dispatch({ 
                type:'multi-set', 
                field:['gameInfo', 'resultVisible'],
                payload:[gameInfo,false]
            })
            setTimeout(()=>navigate('/game'),1000)
        })
        state['socket'].on('gameInfo update',(gameInfo:any)=>{
            dispatch({ type:'set', field:'gameInfo', payload:gameInfo })
        })
        state['socket'].on('counter',(timer:any)=>{
            dispatch({ type:'timer', payload:timer })
        })
        state['socket'].on('end game',(gameInfo:any)=>{
            dispatch({ 
                type:'multi-set',
                field:['gameInfo','resultVisible'], 
                payload:[gameInfo,true]
            })
        })
    },[])
    return (
        <GlobalContext.Provider value={{ global_state:state, dispatch:dispatch }}>
            {children}
        </GlobalContext.Provider>
    )
}
import React from "react"
import { io } from "socket.io-client"
import { createContext } from "react"
import { useNavigate } from "react-router-dom"

export const GlobalContext = createContext<any>({})

export const initialState = {
    name:"",
    socket:io("http://"+process.env.REACT_APP_IP+":9000"),
    chatHistory:[],
    activeUsers:[],
    timer:10,
    gameInfo:{},
}

export function GlobalStateProvider({ children }:any) {
    const navigate = useNavigate()
    const reducer = (state:any, action:any) => {
        const newState = { ...state }
        switch (action.type) {
            case "set":
                newState[action.field] = action.payload
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
            dispatch({ type:'set', field:'gameInfo', payload:gameInfo })
            setTimeout(()=>navigate('/game'),1000)
        })
        state['socket'].on('gameInfo update',(gameInfo:any)=>{
            dispatch({ type:'set', field:'gameInfo', payload:gameInfo })
        })
        state['socket'].on('counter',(timer:any)=>{
            dispatch({ type:'set', field:'timer', payload:timer })
        })
    },[])
    return (
        <GlobalContext.Provider value={{ global_state:state, dispatch:dispatch }}>
            {children}
        </GlobalContext.Provider>
    )
}
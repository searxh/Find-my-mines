import React from 'react'
import { SocketContext } from '../socket'
import { GlobalContext } from '../states'

export default function SocketID() {
    const { socket } = React.useContext(SocketContext)
    const { global_state } = React.useContext(GlobalContext)
    const { connected } = global_state
    const [ id, setId ] = React.useState<string>()
    React.useLayoutEffect(()=>{
        if (socket !== undefined) {
            socket.on('connect',()=>{
                setId(socket.id)
            })
        }
    },[socket])
    return (
        <div className="p-5 bg-red-700 text-white">
            Socket ID: {id} Connected: {connected.toString()}
        </div>
    )
}

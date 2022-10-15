import React from 'react'
import { SocketContext } from '../socket'

export default function SocketID() {
    const { socket } = React.useContext(SocketContext)
    const [ id, setId ] = React.useState<string>()
    React.useEffect(()=>{
        socket.on("connect", ()=>{
            setId(socket.id)
        })
    },[])
    return (
        <div className="p-5 bg-red-700 text-white">
            Socket ID: {id}
        </div>
    )
}

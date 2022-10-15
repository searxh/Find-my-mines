import React from 'react'
import { SocketContext } from '../socket'
import { GlobalContext } from '../states'

export default function ActiveUsers() {
    const { global_state } = React.useContext(GlobalContext)
    const { activeUsers } = global_state
    const { socket } = React.useContext(SocketContext)
    React.useLayoutEffect(()=>{
        socket.emit('active user request')
    },[])
    return (
        <div className="basis-1/2 bg-slate-900 rounded-lg">
           <div className="text-white bg-slate-700 w-full text-center">
                Active Users
            </div>
           <div className="flex flex-col">
                {activeUsers.length !== 0 && activeUsers.map((user:any)=>{
                    return (
                        <div className="flex text-green-400 p-2">
                            <div className="h-3 w-3 bg-green-400 rounded-full my-auto mr-2"/>
                            <div>{user.name}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

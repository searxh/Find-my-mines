import React from 'react'
import { SocketContext } from '../socket'
import { GlobalContext } from '../states'
import { UserType } from '../types'

export default function RematchStatus() {
    const { global_state } = React.useContext(GlobalContext)
    const { socket } = React.useContext(SocketContext)
    const { gameInfo, name, flags } = global_state
    const [ status, setStatus ] = React.useState<string>("")
    //mode 0 = not visible, mode 1 = challenged user view
    //mode 2 = challenger user view, mode 3 = one of the user has left
    const [ mode, setMode ] = React.useState<number>(0)
    const handleOnClick = () => {
        if (socket !== undefined) {
            socket.emit('rematch accepted', gameInfo.roomID)
            setMode(0)
        }
    }
    React.useEffect(()=>{
        if (socket !== undefined) {
            socket.on('rematch request',(requester:UserType)=>{
                if (requester.name !== name) {
                    setMode(1)
                    setStatus(requester.name+" is requesting for a rematch")
                } else {
                    setMode(2)
                    setStatus("Waiting for the other player...")
                }
            })
        }
        if (flags.userLeft) {
            setMode(3)
            setStatus("Other user has left the room")
        }
    },[flags])
    return (mode===1||mode===2?
        <div>
            {status}

            {mode===1 &&
                <button
                    onClick={handleOnClick}
                    className="bg-red-500 text-white px-5 py-2 rounded-lg"
                >
                    Accept
                </button>
            }
        </div>:
        mode===3?
        <div>
            {status}
        </div>
        :null
    )
}

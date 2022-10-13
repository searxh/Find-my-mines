import React from 'react'
import { GlobalContext } from '../states'

export default function RematchStatus() {
    const { global_state } = React.useContext(GlobalContext)
    const { socket, gameInfo, name } = global_state
    const [ requester, setRequester ] = React.useState("")
    const [ mode, setMode ] = React.useState<number>(0)
    const handleOnClick = () => {
        socket.emit('rematch accepted', gameInfo.roomID)
        setMode(0)
    }
    React.useEffect(()=>{
        socket.on('rematch request',(requester:any)=>{
            if (requester.name !== name) {
                setMode(1)
                setRequester(requester.name+" is requesting for a rematch")
            } else {
                setMode(2)
                setRequester("Waiting for the other player...")
            }
        })
    },[])
    return (mode!==0?
        <div>
            {requester}
            {mode===1 &&
                <button
                    onClick={handleOnClick}
                    className="bg-red-500 text-white px-5 py-2 rounded-lg"
                >
                    Accept
                </button>
            }
        </div>:null
    )
}

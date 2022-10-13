import React from 'react'
import { GlobalContext } from '../states'

export default function RematchStatus() {
    const { global_state } = React.useContext(GlobalContext)
    const { socket, gameInfo, name } = global_state
    const [ requester, setRequester ] = React.useState("")
    const [ visible, setVisible ] = React.useState<boolean>(false)
    const handleOnClick = () => {
        socket.emit('rematch accepted', gameInfo.roomID)
        setVisible(false)
    }
    React.useEffect(()=>{
        socket.on('rematch request',(requester:any)=>{
            if (requester.name !== name) {
                setVisible(true)
                setRequester(requester.name+" is requesting for a rematch")
            }
        })
    },[])
    return (visible?
        <div>
            {requester}
            <button
                onClick={handleOnClick}
                className="bg-red-500 text-white px-5 py-2 rounded-lg"
            >
                Accept
            </button>
        </div>:null
    )
}

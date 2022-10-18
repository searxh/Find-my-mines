import React from 'react'
import { SocketContext } from '../socket'
import { GlobalContext } from '../states'

export default function Invite() {
    const { socket } = React.useContext(SocketContext)
    const { global_state } = React.useContext(GlobalContext)
    const { name } = global_state
    const [ mode, setMode ] = React.useState<number>(0)
    const [ senderName, setSenderName ] = React.useState<string>("")
    const [ decision, setDecision ] = React.useState<boolean>(false)
    const handleOnClickDecision = (bool:boolean) => {
        socket.emit("invite reply",{ 
            senderName:senderName,
            receiverName:name,
            decision:bool,
        });
        setMode(0)
    }
    const handleOnClickClose = () => {
        setMode(0)
    }
    React.useEffect(()=>{
        socket.on("request incoming", (senderName:string) => {
            setSenderName(senderName);
            setMode(1);
        });
        socket.on("reply incoming", (decision:boolean) => {
            setDecision(decision);
            setMode(2);
        });
    },[])
    return (
        mode!==0?
            <div
                className="absolute top-0 bottom-0 left-0 right-0 w-1/2 h-[70%] text-white
                text-2xl bg-black rounded-3xl z-50 flex m-auto"
            >
                <button 
                    onClick={handleOnClickClose}
                    className="w-8 h-8 bg-neutral-500 text-center rounded-full"
                >
                    X
                </button>
                {mode===1 &&
                    <div className="">
                        You have received an invitation by {senderName}
                        <button
                            onClick={()=>handleOnClickDecision(true)}
                        >
                            Accept
                        </button>
                        <button
                            onClick={()=>handleOnClickDecision(false)}
                        >
                            Decline
                        </button>
                    </div>
                }
                {mode===2 &&
                    <div className="">
                        Your invitation was {decision?"accepted":"declined"}
                    </div>
                }
            </div>
        :null
    )
}

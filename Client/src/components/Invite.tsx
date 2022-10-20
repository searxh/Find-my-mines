import React from 'react'
import { SocketContext } from '../socket'
import { GlobalContext } from '../states'
import { InviteInfoType, InviteStorageType } from '../types';

export default function Invite() {
    const { socket } = React.useContext(SocketContext);
    const { global_state } = React.useContext(GlobalContext);
    const { name } = global_state;
    const [ mode, setMode ] = React.useState<number>(0);
    //mode 0 = not visible
    //mode 1 = (sender) gets invitation request
    //mode 2 = (sender) gets accepted or decline
    //mode 3 = error occured
    const [ inviteStorage, setInviteStorage ] = React.useState<InviteStorageType>({
        senderName:""
    });
    const [ decision, setDecision ] = React.useState<boolean>(false);
    const handleOnClickDecision = (bool:boolean) => {
        if (socket !== undefined && 
            inviteStorage.senderName+inviteStorage.senderName!==""
        ) {
            socket.emit("invite reply",{ 
                senderName:inviteStorage.senderName,
                receiverName:name,
                decision:bool,
            });
            setMode(0);
        } else {
            console.log('error occured at invite onClick()')
        }
    }
    const handleOnClickClose = (dismiss:boolean) => {
        if (dismiss) {
            handleOnClickDecision(false);
        } else {
            setMode(0);
        }
    }
    React.useEffect(()=>{
        if (socket !== undefined) {
            console.log('listening for request')
            socket.on("request incoming", ({ 
                senderName, roomID, error
            }:InviteInfoType) => {
                console.log(senderName, roomID, error)
                if (error===undefined && senderName!==undefined && roomID!==undefined) {
                    setInviteStorage({ senderName:senderName });
                    setMode(1);
                } else {
                    console.log('undefined')
                    setMode(3);
                }
            });
            socket.on("reply incoming", (decision:boolean) => {
                setDecision(decision);
                setMode(2);
            });
        }
    },[socket])
    return (
        mode!==0?
            <div
                className="absolute top-0 bottom-0 left-0 right-0 w-1/2 h-[70%] text-white
                text-2xl bg-black rounded-3xl z-50 flex m-auto"
            >
                <button 
                    onClick={()=>handleOnClickClose(
                        mode===1?true:false
                    )}
                    className="w-8 h-8 bg-neutral-500 text-center rounded-full"
                >
                    X
                </button>
                {mode===1 &&
                    <div className="">
                        You have received an invitation by {inviteStorage.senderName}
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
                {mode===3 &&
                    <div className="">
                        The invitation is already invalid.
                    </div>
                }
            </div>
        :null
    )
}

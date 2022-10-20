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
                className="absolute top-0 bottom-0 left-0 right-0 w-[30%] h-1/2 text-white
                text-2xl bg-neutral-700 rounded-3xl z-50 flex m-auto shadow-md" 
            >
                <button 
                    onClick={()=>handleOnClickClose(
                        mode===1?true:false
                    )}
                    className="absolute -top-1 -left-1 w-10 h-10 bg-neutral-500
                    text-center rounded-full font-righteous"
                >
                    X
                </button>
                {mode===1 &&
                    <div className="flex flex-col m-auto">
                        <div className="text-3xl font-righteous px-10">
                            YOU HAVE RECEIVED A GAME INVITATION
                        </div>
                        <div className="text-lg font-quicksand pt-2 px-12">
                            The game will start immediately after you accept, this
                            invite will expire in 15 seconds
                        </div>
                        <div className="py-5 text-cyan-300">
                            Inviter: {inviteStorage.senderName}
                        </div>
                        <div className="flex w-full justify-evenly">
                            <button
                                className="bg-green-800 px-8 py-2 text-white rounded-full"
                                onClick={()=>handleOnClickDecision(true)}
                            >
                                Accept
                            </button>
                            <button
                                className="bg-pink-800 px-8 py-2 text-white rounded-full"
                                onClick={()=>handleOnClickDecision(false)}
                            >
                                Decline
                            </button>
                        </div>
                    </div>
                }
                {mode===2 &&
                    <div className="m-auto">
                        <div className="text-4xl font-righteous px-10">
                            YOUR INVITATION WAS {decision?"ACCEPTED":"DECLINED"}
                        </div>
                    </div>
                }
                {mode===3 &&
                    <div className="m-auto">
                        <div className="text-4xl font-righteous px-10">
                            THE INVITATION IS ALREADY INVALID
                        </div>
                    </div>
                }
            </div>
        :null
    )
}

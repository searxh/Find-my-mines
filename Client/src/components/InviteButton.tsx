import React from 'react'
import { SocketContext } from '../socket'
import { GlobalContext } from '../states'
import { UserType } from '../types'

interface InviteButtonPropsType {
    user:UserType;
}

export default function InviteButton({ user }:InviteButtonPropsType) {
    const { global_state } = React.useContext(GlobalContext);
    const { socket } = React.useContext(SocketContext);
    const { activeUsers, name, flags } = global_state;
    const handleOnClick = () => {
        socket.emit("invite request",{ senderName:name, receiverName:user.name });
    };
    const checkCanInvite = () => {
        return (!activeUsers.find((activeUser:UserType)=>
            activeUser.name === user.name)?.inGame
        ) && !flags.isMatching
    };
    return (
        user.name !== name?
        <button
            disabled={!checkCanInvite()}
            className={`w-8 h-8 text-white bg-neutral-500 rounded-full 
            hover:scale-110 transition ${checkCanInvite()?null:"opacity-50"}`}
            onClick={handleOnClick}
        >
            +
        </button>
        :<div />
    );
}

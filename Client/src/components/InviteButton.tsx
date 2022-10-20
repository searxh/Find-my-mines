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
            className={`flex px-3 py-1 justify-evenly hover:scale-110 transition rounded-full
            ${checkCanInvite()?"bg-green-800":"opacity-50 bg-neutral-500"} text-lg`}
            onClick={handleOnClick}
        >
            <div className="text-white">Invite</div>
            <svg
                className="fill-white w-6 h-6 m-auto mx-2"
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 640 512"
            >
                <path d="M352 128c0 70.7-57.3 128-128 128s-128-57.3-128-128S153.3 0 224 0s128 57.3 128 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM504 312V248H440c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V136c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H552v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/>
            </svg>
        </button>
        :<div />
    );
}

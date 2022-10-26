import React from 'react'
import { GlobalContext } from '../states';
import { playAudio } from '../lib/utility/Audio';
import { UserType } from '../types';
import { SocketContext } from '../socket';

export default function ConfettiButton() {
    const { socket } = React.useContext(SocketContext);
    const { global_state } = React.useContext(GlobalContext);
    const { gameInfo, name } = global_state;
    const handleOnClick = () => {
        const target = gameInfo.users.find((user:UserType)=>user.name!==name);
        console.log("confetti to",target)
        if (socket !== undefined && target !== undefined) {
            socket.emit("confetti",{ 
                roomID:gameInfo.roomID,
                targetPlayer:target.name,
            });
        }
        playAudio('pop.wav');
    }
    return (
        <button
            onClick={handleOnClick}
            className="absolute right-5 -bottom-16 bg-pink-500 rounded-full p-2 hover:scale-105 
            transition w-[45%] m-auto text-white text-2xl font-righteous shadow-md hover:opacity-80"
        >
            CHEERS
        </button>
    )
}

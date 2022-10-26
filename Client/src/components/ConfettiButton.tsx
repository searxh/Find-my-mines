import React from 'react'
import { GlobalContext } from '../states';
import { playAudio } from '../lib/utility/Audio';
import { UserType } from '../types';
import { SocketContext } from '../socket';
import Countdown from './Countdown';

export default function ConfettiButton() {
    const { socket } = React.useContext(SocketContext);
    const { global_state } = React.useContext(GlobalContext);
    const { gameInfo, name } = global_state;
    const [ cooldown, setCooldown ] = React.useState<boolean>(false);
    const handleOnClick = () => {
        const target = gameInfo.users.find((user:UserType)=>user.name!==name);
        console.log("confetti to",target)
        if (socket !== undefined && target !== undefined) {
            setCooldown(true);
            socket.emit("confetti",{ 
                roomID:gameInfo.roomID,
                targetPlayer:target.name,
            });
        }
        playAudio('pop.wav');
    }
    return (
        <button
            disabled={cooldown}
            onClick={handleOnClick}
            className={`absolute flex right-5 -bottom-16 bg-pink-500 rounded-full p-2 hover:scale-105 
            transition w-[45%] m-auto text-white text-2xl font-righteous shadow-md
            justify-center ${cooldown?"opacity-50":"opacity-100"}`}
        >
            <div className="">
                CHEERS
            </div>
            {cooldown &&
                <div className="mx-2 text-pink-200">
                    <Countdown
                        seconds={5}
                        trigger={cooldown}
                        callback={()=>{
                            setCooldown(false);
                        }}
                    />
                </div>
            }
        </button>
    )
}

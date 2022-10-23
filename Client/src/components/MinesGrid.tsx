import React from 'react'
import { GlobalContext } from '../states'
import { playAudio } from '../lib/utility/Audio'
import { BlockType } from '../types'
import { SocketContext } from '../socket'
import Image from './Image'
import FoundMineEffect from './FoundMineEffect'

export default function MinesGrid() {
    const { global_state } = React.useContext(GlobalContext)
    const { gameInfo, name } = global_state
    const checkPlayerCanInteract = () => {
        const playingUser =  gameInfo.users[gameInfo.playingUser]
        return playingUser.name === name
    }
    return (
        <div className={`w-fit grid grid-cols-6 gap-2 m-auto p-5 rounded-3xl transition duration-500
        ${checkPlayerCanInteract()?"bg-gradient-to-r from-teal-300 to-sky-300":"bg-neutral-500 bg-opacity-70"}`}>
            {gameInfo.minesArray.map(
                (block:BlockType,index:number)=>{
                    return <Block block={block} index={index} />
                })
            }
        </div>
    )
}

function Block({ block, index }:{ block:BlockType, index:number }) {
    const { global_state } = React.useContext(GlobalContext);
    const { socket } = React.useContext(SocketContext);
    const { gameInfo, name } = global_state;
    const handleOnClick = () => {
        if (socket !== undefined) {
            socket.emit('select block',{ 
                index:index, 
                roomID:gameInfo.roomID,
                name:name
            });
            playAudio('dig.wav');
            if (block.value === 1) {
                setTimeout(()=>playAudio("found.wav"),300);
            } else {
                setTimeout(()=>playAudio("wrong.mp3"),300);
            }
        }
    }
    const checkPlayerCanInteract = () => {
        const playingUser =  gameInfo.users[gameInfo.playingUser];
        return playingUser.name === name;
    }
    return (
        <div className="relative">
            {block.value === 1 && block.selected && block.selectedBy===name &&
                <FoundMineEffect 
                    minesType={block.type} 
                    trigger={block.selected}
                />
            }
            <button
                disabled={block.selected || !checkPlayerCanInteract()}
                onClick={handleOnClick}
                className={`flex h-20 w-20 gap-2 transition duration-400 
                    ${!block.selected && checkPlayerCanInteract()?
                        "hover:bg-gradient-to-t from-cyan-500 to-pink-500":
                        "hover:opacity-60"
                    }
                    ${block.selectedBy===""?null:
                    block.selectedBy===name?"border-[0.5px] scale-110 brightness-125 bg-opacity-60":
                    "brightness-50"}
                    ${block.selected?"bg-opacity-50 bg-neutral-400":"bg-slate-700 hover:scale-110"} 
                    transition rounded-md shadow-lg`}
            >
                {block.value === 1 && block.selected &&
                    <Image 
                        type={block.type as string} 
                        className="animate-spin-slow drop-shadow-md"
                    />
                }
            </button>
        </div>
    )
}

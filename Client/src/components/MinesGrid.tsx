import React from 'react'
import { GlobalContext } from '../states'
import { playAudio } from '../lib/utility/Audio'
import { BlockType } from '../types'
import { SocketContext } from '../socket'

export default function MinesGrid() {
    const { global_state } = React.useContext(GlobalContext)
    const { gameInfo } = global_state
    return (
        <div className="w-fit grid grid-cols-6 gap-2 m-auto bg-gradient-to-r
        from-teal-200 to-sky-200 p-5 rounded-3xl">
            {gameInfo.minesArray.map(
                (block:BlockType,index:number)=>{
                    return <Block block={block} index={index} />
                })
            }
        </div>
    )
}

function Block({ block, index }:{ block:BlockType, index:number }) {
    const { global_state } = React.useContext(GlobalContext)
    const { socket } = React.useContext(SocketContext) 
    const { gameInfo, name } = global_state
    const handleOnClick = () => {
        if (socket !== undefined) {
            socket.emit('select block',{ index:index, roomID:gameInfo.roomID })
            playAudio('pop.wav')
        }
    }
    const checkPlayerCanInteract = () => {
        const playingUser =  gameInfo.users[gameInfo.playingUser]
        return playingUser.name === name
    }
    return (
        <button
            disabled={block.selected || !checkPlayerCanInteract()}
            onClick={handleOnClick}
            className={`flex h-20 w-20 gap-2 transition duration-400 
                ${!block.selected && checkPlayerCanInteract()?
                    "hover:bg-gradient-to-t from-cyan-500 to-pink-500":
                    "hover:opacity-60"
                }
                ${block.selected?"bg-white":"bg-slate-700 hover:scale-110"} 
                transition rounded-md shadow-md`}
        >
            {block.value===1 && block.selected &&
                <img
                    className="w-full object-contain"
                    src="assets/images/CommonMine.png"
                    alt=""
                />
            }

        </button>
    )
}

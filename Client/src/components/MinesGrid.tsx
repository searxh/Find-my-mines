import React from 'react'
import { GlobalContext } from '../states'
import { playAudio } from '../lib/utility/Audio'
import { BlockType } from '../types'
import { SocketContext } from '../socket'

export default function MinesGrid() {
    const { global_state } = React.useContext(GlobalContext)
    const { gameInfo } = global_state
    return (
        <div className="w-fit grid grid-cols-6 gap-2 mx-auto">
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
        socket.emit('select block',{ index:index, roomID:gameInfo.roomID })
        playAudio('pop.wav')
    }
    const checkPlayerCanInteract = () => {
        const playingUser =  gameInfo.users[gameInfo.playingUser]
        return playingUser.name === name
    }
    return (
        <button
            disabled={block.selected || !checkPlayerCanInteract()}
            onClick={handleOnClick}
            className={`flex h-14 w-14 
                ${block.selected?"bg-white":"bg-slate-700 hover:scale-110"} 
                transition rounded-md`}
        >
            {block.value===1 && block.selected &&
                <div className="m-auto text-center h-10 w-10 bg-red-500 text-white">Bomb</div>
            }

        </button>
    )
}

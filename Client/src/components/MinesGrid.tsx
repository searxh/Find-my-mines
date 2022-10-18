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
                <svg
                    className="fill-red-500 w-[90%] m-auto"
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 640 512"
                >
                    <path d="M344 24V168c0 13.3-10.7 24-24 24s-24-10.7-24-24V24c0-13.3 10.7-24 24-24s24 10.7 24 24zM192 320c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32v32H192V320zm-77.3 90.5c8.1-16.3 24.8-26.5 42.9-26.5H482.3c18.2 0 34.8 10.3 42.9 26.5l27.6 55.2C563.5 487 548 512 524.2 512H115.8c-23.8 0-39.3-25-28.6-46.3l27.6-55.2zM36.3 138.3c7.5-10.9 22.5-13.6 33.4-6.1l104 72c10.9 7.5 13.6 22.5 6.1 33.4s-22.5 13.6-33.4 6.1l-104-72c-10.9-7.5-13.6-22.5-6.1-33.4zm534.1-6.1c10.9-7.5 25.8-4.8 33.4 6.1s4.8 25.8-6.1 33.4l-104 72c-10.9 7.5-25.8 4.8-33.4-6.1s-4.8-25.8 6.1-33.4l104-72z"/>
                </svg>
            }

        </button>
    )
}

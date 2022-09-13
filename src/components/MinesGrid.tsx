import React from 'react'
import { GlobalContext } from '../states'

export default function MinesGrid() {
    const { global_state } = React.useContext(GlobalContext)
    return (
        <div className="w-fit grid grid-cols-6 gap-2 mx-auto">
            {global_state['gameInfo'].minesArray.map(
                (block:any,index:number)=>{
                    return <Block block={block} index={index} />
                })
            }
        </div>
    )
}

interface BlockTypes {
    selected:boolean,
    value:number
}

function Block({ block, index }:{ block:BlockTypes, index:number }) {
    const { global_state } = React.useContext(GlobalContext)
    const handleOnClick = () => {
        global_state['socket'].emit('select block',index)
    }
    const checkPlayerCanInteract = () => {
        const gameInfo = global_state['gameInfo']
        const playingUser =  gameInfo.users[gameInfo.playingUser]
        return playingUser.name === global_state['name']
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

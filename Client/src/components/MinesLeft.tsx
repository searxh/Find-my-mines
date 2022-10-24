import React from 'react'
import { GlobalContext } from '../states'
import { BlockType } from '../types';

interface MinesLeftKey {
    [key: string]: number;
}

interface MinesLeftType extends MinesLeftKey {
    legendary:number;
    epic:number;
    rare:number;
    common:number;
}

const initialMinesLeftObj = {
    legendary:1,
    epic:2,
    rare:3,
    common:5,
}

export default function MinesLeft() {
    const { global_state } = React.useContext(GlobalContext);
    const { gameInfo } = global_state;
    const [ minesLeft, setMinesLeft ] = React.useState<MinesLeftType>(initialMinesLeftObj);
    React.useEffect(()=>{
        if (gameInfo.minesArray !== undefined) {
            const minesLeftObj:MinesLeftType = { ...initialMinesLeftObj }
            gameInfo.minesArray.forEach((block:BlockType)=>{
                if (block.type !== null && block.selected) {
                    minesLeftObj[block.type.toLowerCase()] = minesLeftObj[block.type.toLowerCase()]-1;
                }
            })
            setMinesLeft(minesLeftObj)
        }
    },[gameInfo.minesArray])
    return (
        <div className="text-white">
            Legendary {minesLeft.legendary}
            Epic {minesLeft.epic}
            Rare {minesLeft.rare}
            Common {minesLeft.common}
        </div>
    )
}

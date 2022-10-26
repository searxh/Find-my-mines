import React from 'react'
import { playAudio } from '../lib/utility/Audio';
import { GlobalContext } from '../states';

export default function SurrenderButton() {
    const { global_state, dispatch } = React.useContext(GlobalContext);
    const { flags } = global_state;
    const handleOnClick = () => {
        const newFlags = { ...flags, confirmationVisible:true };
        dispatch({
            type: "set",
            field: "flags",
            payload: newFlags,
        })
        playAudio('pop.wav');
    }
    return (
        <button
            onClick={handleOnClick}
            className="absolute left-5 -bottom-16 bg-red-800 rounded-full p-2 hover:scale-105 
            transition w-[45%] m-auto text-white text-2xl font-righteous shadow-md hover:opacity-80"
        >
            SURRENDER
        </button>
    )
}

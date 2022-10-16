import React from 'react'
import { GlobalContext } from '../states';
import { useNavigate } from 'react-router-dom';

export default function Name() {
    const { dispatch } = React.useContext(GlobalContext)
    const navigate = useNavigate()
    const nameRef = React.useRef<HTMLInputElement>(null);
    const handleOnSubmit = () => {
        if (nameRef.current !== null) {
            dispatch({
                type:'set',
                field:'name',
                payload:nameRef.current.value
            })
            nameRef.current.value = ""
            navigate('menu')
        }
    }
    return (
        <div className="flex flex-col bg-neutral-800 w-full h-screen p-5">
            <div className="font-fredoka text-4xl text-white text-center">
                FIND MY MINES
            </div>
            <input
                placeholder="Enter Your Name"
                className="rounded-full my-5 text-center p-2"
                ref={nameRef}
            />
            <button
                className="bg-green-200 p-2 rounded-lg"
                onClick={handleOnSubmit}
            >
                Enter
            </button>
        </div>
    )
}

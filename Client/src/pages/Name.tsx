import React, { FormEvent } from 'react'
import { GlobalContext } from '../states';
import { useNavigate } from 'react-router-dom';

export default function Name() {
    const { dispatch } = React.useContext(GlobalContext)
    const navigate = useNavigate()
    const nameRef = React.useRef<HTMLInputElement>(null);
    const handleOnSubmit = (e:FormEvent) => {
        e.preventDefault()
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
        <div className="flex bg-neutral-800 w-full h-screen p-5">
            <form className="flex flex-col m-auto p-2">
                <div className="font-allerta text-6xl text-white text-center">
                    FIND MY MINES
                </div>
                <input
                    placeholder="Enter Your Name"
                    className="rounded-full text-center p-2 font-quicksand 
                    bg-neutral-500 text-white placeholder-white shadow-md my-5"
                    ref={nameRef}
                />
                <div className="flex justify-center p-5">
                    <button
                        className="bg-green-600 text-white p-2 rounded-full 
                        font-quicksand w-1/2 shadow-md"
                        onClick={(e:FormEvent)=>handleOnSubmit(e)}
                    >
                        PLAY
                    </button>
                </div>
            </form>
        </div>
    )
}

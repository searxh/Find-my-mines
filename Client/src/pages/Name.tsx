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
                <div className="relative mb-10">
                    <div className="font-righteous text-6xl text-white text-center animate-pulse-slow">
                        FIND MY MINES
                        <div className="font-quicksand absolute left-0 right-0 top-20 text-3xl">
                            GROUP 6
                        </div>
                    </div>
                </div>
                <input
                    placeholder="Enter Your Name"
                    className="rounded-full text-center p-2 font-quicksand 
                    bg-neutral-500 text-white placeholder-white shadow-md my-5
                    hover:bg-neutral-700 transition duration-[2000ms]"
                    ref={nameRef}
                />
                <div className="flex justify-center p-5">
                    <button
                        className="bg-green-600 text-white p-2 rounded-full 
                        font-quicksand w-1/2 shadow-md hover:scale-105 transition
                        hover:bg-pink-800 duration-500"
                        onClick={(e:FormEvent)=>handleOnSubmit(e)}
                    >
                        PLAY
                    </button>
                </div>
            </form>
        </div>
    )
}

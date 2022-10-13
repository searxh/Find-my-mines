import React from 'react'
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../states';
import SocketID from '../components/SocketID';

export default function Name() {
    const { global_state, dispatch } = React.useContext(GlobalContext)
    const navigate = useNavigate();
    const nameRef = React.useRef<HTMLInputElement>(null);
    const handleOnSubmit = () => {
        if (nameRef.current !== null) {
            dispatch({
                type:'set',
                field:'name',
                payload:nameRef.current.value
            })
            global_state['socket'].emit('name register',
                {
                    name:nameRef.current.value,
                    id:global_state['socket'].id
                }
            )
            navigate('/menu')
        }
    }
    return (
        <div className="flex flex-col bg-black w-full h-screen p-5">
            <SocketID />
            <div className="text-white text-center">Enter your name</div>
            <input
                className="rounded-lg my-5"
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

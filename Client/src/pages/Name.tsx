import React from 'react'
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../states';
import SocketID from '../components/SocketID';
import { io } from 'socket.io-client';

export default function Name() {
    const { dispatch } = React.useContext(GlobalContext)
    const navigate = useNavigate();
    const nameRef = React.useRef<HTMLInputElement>(null);
    const handleOnSubmit = () => {
        if (nameRef.current !== null) {
            dispatch({
                type:'multi-set',
                field:['name','socket'],
                payload:[nameRef.current.value,io("http://"+process.env.REACT_APP_IP+":9000")]
            })
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

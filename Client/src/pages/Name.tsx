import React from 'react'
import { GlobalContext } from '../states';
import { io } from 'socket.io-client';
import { SocketContext } from '../socket';
import { useNavigate } from 'react-router-dom';

export default function Name() {
    const { dispatch } = React.useContext(GlobalContext)
    const { setSocket } = React.useContext(SocketContext)
    const navigate = useNavigate()
    const nameRef = React.useRef<HTMLInputElement>(null);
    const handleOnSubmit = () => {
        if (nameRef.current !== null) {
            dispatch({
                type:'set',
                field:'name',
                payload:nameRef.current.value
            })
            setSocket(io("http://"+process.env.REACT_APP_IP+":9000"))
            navigate('menu')
        }
    }
    return (
        <div className="flex flex-col bg-black w-full h-screen p-5">
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

import React from 'react'
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../socket'
import { GlobalContext } from '../states';

export default function SurrenderButton() {
    const { socket } = React.useContext(SocketContext);
    const { global_state } = React.useContext(GlobalContext);
    const { gameInfo } = global_state;
    const navigate = useNavigate();
    const handleOnClick = () => {
        if (socket !== undefined) {
            socket.emit("leave room request", gameInfo.roomID);
            navigate('/menu');
        }
    }
    return (
        <button
            onClick={handleOnClick}
            className="absolute left-0 right-0 -bottom-16 bg-red-800 rounded-full p-2 hover:scale-105 
            transition w-[90%] m-auto text-white text-2xl font-righteous shadow-md hover:opacity-80"
        >
            SURRENDER
        </button>
    )
}

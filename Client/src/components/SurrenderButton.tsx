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
            className="bg-neutral-500 rounded-full p-5 hover:scale-105 transition"
        >
            Surrender
        </button>
    )
}

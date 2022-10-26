import React from 'react'
import Chat from '../components/Chat'
import MinesGrid from '../components/MinesGrid'
import Result from '../components/Result'
import { GlobalContext } from '../states'
import SocketID from '../components/SocketID'
import Backdrop from '../components/Backdrop'
import UserScore from '../components/UserScore'
import { getUserColor } from '../lib/utility/GetUserColor'
import MinesLeft from '../components/MinesLeft'
import SurrenderButton from '../components/SurrenderButton'
import Confirmation from '../components/Confirmation'
import { SocketContext } from '../socket'
import { useNavigate } from 'react-router-dom'
import Confetti from '../components/Confetti'
import ConfettiButton from '../components/ConfettiButton'

export default function Game() {
    const { global_state, dispatch } = React.useContext(GlobalContext);
    const { socket } = React.useContext(SocketContext);
    const { gameInfo, name, activeUsers, flags } = global_state;
    const navigate = useNavigate();
    const { 
        users,
        scores,
        playingUser,
        timer
    } = gameInfo;
    return (
        <div className="flex flex-col h-screen overflow-hidden text-center font-quicksand 
        bg-gradient-to-t from-transparent to-slate-700">
            <div className="absolute top-0 botom-0 left-0 right-0 -z-10 bg-cover blur-sm
            bg-[url('../public/assets/images/bg.png')] flex-1 h-screen opacity-50"/>
            <Result />
            <Backdrop />
            <Confetti trigger={flags.confettiVisible} />
            <Confirmation
                title="Are you sure you wish to surrender?"
                content="You will lose and leave the game room immediately"
                decisionCallback={(decision:boolean)=>{
                    if (decision && socket !== undefined) {
                        socket.emit("leave room request", gameInfo.roomID);
                        navigate('/menu');
                    }
                    const newFlags = { ...flags, confirmationVisible:false };
                    dispatch({
                        type:"set",
                        field:"flags",
                        payload: newFlags,
                    })
                }}
            />
            <div className="flex-1 flex justify-evenly p-2">
                <div className="flex basis-[30%] h-[70vh] m-auto">
                    <div className="w-full m-auto">
                        <div 
                            className={`text-4xl text-white drop-shadow-md
                            w-[70%] rounded-3xl mx-auto`}
                            style={{
                                color:getUserColor(activeUsers,name),
                            }}
                        >
                            {name.toUpperCase()}
                        </div>
                        <div 
                            style={{
                                color:getUserColor(activeUsers,users[playingUser].name),
                            }}
                            className="font-righteous text-4xl text-white p-3 drop-shadow-md"
                        >
                            TIMER: {timer}
                        </div>
                        <UserScore 
                            name={users[0].name} 
                            score={scores[0]} 
                            isPlaying={playingUser===0?true:false}
                            activeUsers={activeUsers}
                            className="my-3"
                        />
                        <UserScore 
                            name={users[1].name} 
                            score={scores[1]} 
                            isPlaying={playingUser===1?true:false}
                            activeUsers={activeUsers}
                            className="my-3 mb-10"
                        />
                        <MinesLeft />
                    </div>
                </div>
                <div className="flex basis-[40%] h-[70vh] m-auto">
                    <MinesGrid />
                </div>
                <div className="flex flex-col basis-[30%] m-auto relative">
                    <div className="w-[90%] bg-zinc-600 h-[70vh] bg-opacity-70 p-5 rounded-3xl m-auto">
                        <Chat />
                    </div>
                    <SurrenderButton />
                    <ConfettiButton />
                </div>
            </div>
            <SocketID />
        </div>
    )
}

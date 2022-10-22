import React from 'react'
import Chat from '../components/Chat'
import MinesGrid from '../components/MinesGrid'
import Result from '../components/Result'
import { GlobalContext } from '../states'
import SocketID from '../components/SocketID'
import Backdrop from '../components/Backdrop'
import UserScore from '../components/UserScore'

export default function Game() {
    const { global_state } = React.useContext(GlobalContext)
    const { gameInfo, name } = global_state
    const { 
        users,
        scores,
        playingUser,
        timer
    } = gameInfo
    return (
        <div className="flex flex-col h-screen overflow-hidden text-center font-quicksand 
        bg-gradient-to-t from-transparent to-slate-600">
            <div className="absolute top-0 botom-0 left-0 right-0 -z-10 bg-cover blur-sm
            bg-[url('../public/assets/images/bg.png')] flex-1 h-screen opacity-50"/>
            <Result />
            <Backdrop />
            <div className="flex-1 flex justify-evenly p-2">
                <div className="flex basis-[30%] h-[70vh] m-auto">
                    <div className="w-[90%] m-auto">
                        <div className="text-4xl text-white
                        w-[70%] rounded-2xl mb-10 mx-auto">
                            {name.toUpperCase()}
                        </div>
                        <UserScore 
                            name={users[0].name} 
                            score={scores[0]} 
                            isPlaying={playingUser===0?true:false}
                            className="my-3"
                        />
                        <UserScore 
                            name={users[1].name} 
                            score={scores[1]} 
                            isPlaying={playingUser===1?true:false}
                            className="my-3"
                        />
                        <div className="font-righteous text-5xl text-white p-5">
                            TIMER: {timer}
                        </div>
                    </div>
                </div>
                <div className="flex basis-[40%] h-[70vh] m-auto">
                    <MinesGrid />
                </div>
                <div className="flex basis-[30%] h-[70vh] m-auto">
                    <div className="w-[90%] h-full bg-neutral-500 bg-opacity-70 p-5 rounded-3xl m-auto">
                        <Chat />
                    </div>
                </div>
            </div>
            <SocketID />
        </div>
    )
}

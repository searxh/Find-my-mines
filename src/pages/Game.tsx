import React from 'react'
import Chat from '../components/Chat'
import MinesGrid from '../components/MinesGrid'
import { GlobalContext } from '../states'
import SocketID from '../components/SocketID'

export default function Game() {
    const { global_state } = React.useContext(GlobalContext)
    const { gameInfo } = global_state
    const { 
        users,
        scores,
        playingUser,
        timer
    } = gameInfo
    return (
        <div className="">
            <div className="text-2xl text-white">
                {users[0].name} vs. {users[1].name}
            </div>
            <div className="text-2xl text-white">
                {scores[0]} vs. {scores[1]}
            </div>
            <div className="text-xl text-cyan-400">
                {users[playingUser].name}
            </div>
            <div className="text-2xl text-cyan-400">
                Timer: {timer}
            </div>
            <SocketID />
            <MinesGrid />
            <Chat />
        </div>
    )
}

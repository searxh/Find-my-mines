import React from 'react'
import Chat from '../components/Chat'
import MinesGrid from '../components/MinesGrid'
import { GlobalContext } from '../states'

export default function Game() {
    const { global_state } = React.useContext(GlobalContext)
    return (
        <div className="">
            <div className="text-2xl text-white">
                {global_state['gameInfo'].users[0].name} vs. {global_state['gameInfo'].users[1].name}
            </div>
            <div className="text-2xl text-white">
                {global_state['gameInfo'].scores[0]} vs. {global_state['gameInfo'].scores[1]}
            </div>
            <div className="text-xl text-cyan-400">
                {global_state['gameInfo'].users[global_state['gameInfo'].playingUser].name}
            </div>
            <div className="text-2xl text-cyan-400">
                Timer: {global_state['timer']}
            </div>
            <MinesGrid />
            <Chat />
        </div>
    )
}

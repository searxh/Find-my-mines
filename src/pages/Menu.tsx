import React from 'react'
import ActiveUsers from '../components/ActiveUsers'
import Chat from '../components/Chat'
import MatchingButton from '../components/MatchingButton'
import { GlobalContext } from '../states'

export default function Menu() {
    const { global_state } = React.useContext(GlobalContext)
    return (
        <div className="text-center">
            <div className="text-4xl text-white p-5">Welcome, {global_state['name']}</div>
            <ActiveUsers />
            <MatchingButton />
            <Chat />
        </div>
    )
}

import React from 'react'
import ActiveUsers from '../components/ActiveUsers'
import Chat from '../components/Chat'
import MatchingButton from '../components/MatchingButton'
import SocketID from '../components/SocketID'

export default function Menu() {
    return (
        <div className="flex flex-col h-screen overflow-clip text-center font-quicksand bg-neutral-800">
            <div className="text-6xl font-allerta text-white pt-3">FIND MY MINES</div>
            <div className="flex-1 flex justify-evenly p-5">
                <div className="basis-1/3 h-[70vh]">
                    <div className="text-3xl font-allerta text-white w-full text-center mb-2">
                        ONLINE USERS
                    </div>
                    <div className="flex flex-col h-full justify-evenly bg-neutral-600 p-5 rounded-lg">
                        <ActiveUsers />
                        <MatchingButton />
                    </div>
                </div>
                <div className="basis-1/3 h-[70vh]">
                    <div className="text-3xl font-allerta text-white w-full text-center mb-2">
                        CHAT
                    </div>
                    <div className="h-full bg-neutral-600 p-5 rounded-lg">
                        <Chat />
                    </div>
                </div>
            </div>
            <SocketID />
        </div>
    )
}

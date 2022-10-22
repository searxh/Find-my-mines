import React from 'react'
import ActiveUsers from '../components/ActiveUsers';
import Chat from '../components/Chat';
import RequestReceiver from '../components/RequestReceiver';
import ReplyReceiver from '../components/ReplyReceiver';
import MatchingButton from '../components/MatchingButton';
import SocketID from '../components/SocketID';

export default function Menu() {
    return (
        <div className="flex flex-col h-screen overflow-hidden text-center font-quicksand
        bg-gradient-to-t from-transparent to-slate-600">
            <div className="absolute top-0 botom-0 left-0 right-0 -z-10 bg-cover animate-pulse-ultra-slow
            bg-[url('../public/assets/images/bg.jpg')] flex-1 h-screen blur-3xl"/>
            <RequestReceiver />
            <ReplyReceiver />
            <div className="text-5xl font-righteous text-white pt-3">FIND MY MINES</div>
            <div className="flex-1 flex justify-evenly p-2">
                <div className="basis-[40%] h-[70vh]">
                    <div className="text-3xl font-righteous text-white w-full text-center mb-2">
                        ONLINE USERS
                    </div>
                    <div className="flex flex-col h-full justify-evenly bg-black
                    bg-opacity-20 p-5 rounded-3xl">
                        <ActiveUsers />
                        <div className="flex py-2">
                        <MatchingButton />
                        </div>
                    </div>
                </div>
                <div className="basis-[40%] h-[70vh]">
                    <div className="text-3xl font-righteous text-white w-full text-center mb-2">
                        CHAT
                    </div>
                    <div className="h-full bg-black bg-opacity-20 p-5 rounded-3xl">
                        <Chat />
                    </div>
                </div>
            </div>
            <SocketID />
        </div>
    )
}

import React from 'react'
import ActiveUsers from '../components/ActiveUsers';
import Chat from '../components/Chat';
import RequestReceiver from '../components/RequestReceiver';
import ReplyReceiver from '../components/ReplyReceiver';
import MatchingButton from '../components/MatchingButton';
import SocketID from '../components/SocketID';
import MessageTextArea from '../components/MessageTextArea';

export default function Menu() {
    return (
        <div className="flex flex-col h-screen overflow-hidden text-center font-quicksand
        bg-gradient-to-t from-transparent to-slate-700">
            <div className="absolute top-0 botom-0 left-0 right-0 -z-10 bg-cover blur-sm
            bg-[url('../public/assets/images/bg.png')] flex-1 h-screen opacity-50"/>
            <RequestReceiver />
            <ReplyReceiver />
            <div className="text-5xl font-righteous text-white pt-5">FIND MY MINES</div>
            <div className="flex-1 flex justify-evenly p-1 pt-0">
                <div className="basis-[40%] h-[70vh]">
                    <div className="text-3xl font-righteous text-white w-full text-center mb-2">
                        ONLINE USERS
                    </div>
                    <div className="flex flex-col h-full justify-evenly shadow-md
                    bg-zinc-600 bg-opacity-80 p-5 rounded-3xl">
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
                    <div className="h-full bg-zinc-600 bg-opacity-80 p-5 rounded-3xl shadow-md">
                        <Chat />
                    </div>
                </div>
            </div>
            <SocketID />
        </div>
    )
}

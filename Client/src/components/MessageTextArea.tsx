import React from 'react'
import { GlobalContext } from '../states'

export default function MessageTextArea() {
    const { global_state, dispatch } = React.useContext(GlobalContext);
    const { flags } = global_state;
    const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
    const handleOnClose = () => {
        const newFlags = { 
            ...flags, 
            messageTextAreaVisible: false,
        } 
        dispatch({
            type:"set",
            field:"flags",
            payload:newFlags,
        });
    }
    const handleOnClick = () => {
        const newFlags = { 
            ...flags, 
            sendInvite: true,
            messageTextAreaVisible: false,
        } 
        dispatch({
            type:"set",
            field:"flags",
            payload:newFlags,
        });
    }
    const setMessage = () => {
        console.log('on blur fired')
        if (textAreaRef.current !== null) {
            dispatch({
                type:"set",
                field:"inviteMessage",
                payload:textAreaRef.current.value,
            });
        }
    }
    return (
        flags.messageTextAreaVisible?
        <div className="absolute flex top-0 bottom-0 left-0 right-0 z-30
        bg-black bg-opacity-80 rounded-3xl p-4 w-[30%] h-1/2 m-auto">
            <button 
                onClick={handleOnClose}
                className="absolute -top-1 -left-1 w-10 h-10 bg-neutral-500 text-white
                text-center rounded-full font-righteous hover:scale-110 transition"
            >
                X
            </button>
            <div className="flex flex-1 flex-col m-auto h-full justify-evenly">
                <textarea 
                    onBlur={setMessage}
                    placeholder="Type in invite message"
                    ref={textAreaRef}
                    className="basis-[90%] bg-neutral-800 bg-opacity-90 text-white 
                    rounded-3xl p-5 resize-none mb-3"
                >
                </textarea>
                <button
                    className="basis-[10%] bg-green-600 p-2 rounded-full 
                    hover:scale-105 transition text-white text-xl text-center"
                    onClick={handleOnClick}
                >
                    Send Invite
                </button>
            </div>
        </div>
        :null
    )
}

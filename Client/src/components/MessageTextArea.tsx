import React from 'react'
import { GlobalContext } from '../states'

export default function MessageTextArea() {
    const { global_state, dispatch } = React.useContext(GlobalContext);
    const { flags } = global_state;
    const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
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
        bg-black bg-opacity-80 rounded-3xl p-5 w-1/2 h-1/2 m-auto">
            <div className="flex flex-col m-auto">
                <textarea 
                    onBlur={setMessage}
                    placeholder="Type in invite message"
                    ref={textAreaRef}
                    className="bg-white text-black"
                >
                </textarea>
                <button
                    className="bg-green-500 p-3 rounded-full"
                    onClick={handleOnClick}
                >
                    Send Invite
                </button>
            </div>
        </div>
        :null
    )
}

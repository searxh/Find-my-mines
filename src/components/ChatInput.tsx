import React from 'react'
import { GlobalContext } from '../states';

export default function ChatInput() {
    const { global_state } = React.useContext(GlobalContext)
    const messageRef = React.useRef<any>(null);
    const handleOnSubmit = () => {
        if (messageRef.current !== null) {
            global_state['socket'].emit('chat message',{ 
                msg:messageRef.current.value,
                name:global_state['name'],
                id:global_state['socket'].id,
            });
            messageRef.current.value = ""
        }
    }
    return (
        <div className="basis-1/2 bg-black rounded-lg flex p-2">
            <input 
                ref={messageRef}
                className="w-9/12 rounded-lg"
            />
            <button
                className="w-3/12 bg-green-300 p-2 rounded-lg hover:bg-green-400 transition"
                onClick={handleOnSubmit}
            >
                Send
            </button>
        </div>
    )
}

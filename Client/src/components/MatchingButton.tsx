import React from 'react'
import { SocketContext } from '../socket'
import { GlobalContext } from '../states'

export default function MatchingButton() {
    const { global_state } = React.useContext(GlobalContext)
    const { name } = global_state
    const { socket } = React.useContext(SocketContext)
    const [ isMatching, setIsMatching ] = React.useState<boolean>(false)
    const [ cooldown, setCooldown ] = React.useState<boolean>(false)
    const handleOnClick = () => {
        if (socket !== undefined) {
            const newIsMatching = !isMatching
            socket.emit(newIsMatching?'matching':'unmatching',{
                name:name,
                id:socket.id
            })
            setIsMatching(newIsMatching)
            setCooldown(true)
            setTimeout(()=>setCooldown(false),1000)
        }
    }
    return (
        <button
            disabled={cooldown}
            onClick={handleOnClick}
            className={`flex m-auto ${isMatching?"bg-green-600":"bg-slate-600"} rounded-lg p-3 px-5 text-center
            text-white hover:scale-105 transition`}
        >
            <div>Match</div>
            {isMatching && 
                <svg
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 512 512"
                    className="animate-spin w-6 h-6 fill-slate-300 ml-2"
                >
                    <path d="M304 48c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zm0 416c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zM48 304c26.5 0 48-21.5 48-48s-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48zm464-48c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zM142.9 437c18.7-18.7 18.7-49.1 0-67.9s-49.1-18.7-67.9 0s-18.7 49.1 0 67.9s49.1 18.7 67.9 0zm0-294.2c18.7-18.7 18.7-49.1 0-67.9S93.7 56.2 75 75s-18.7 49.1 0 67.9s49.1 18.7 67.9 0zM369.1 437c18.7 18.7 49.1 18.7 67.9 0s18.7-49.1 0-67.9s-49.1-18.7-67.9 0s-18.7 49.1 0 67.9z"/>
                </svg>
            }
        </button>
    )
}

import React from 'react'
import { useNavigate } from 'react-router-dom'
import RematchStatus from './RematchStatus'
import { GlobalContext } from '../states'
import { SocketContext } from '../socket'

export default function Result() {
    const { global_state, dispatch } = React.useContext(GlobalContext)
    const { socket } = React.useContext(SocketContext)
    const { resultVisible, gameInfo, name } = global_state
    const { users, scores } = gameInfo
    const [ playAgainVisible, setPlayAgainVisible ] = React.useState(true)
    const navigate = useNavigate()
    const handleOnClickPlayAgain = () => {
        socket.emit("play again", { 
            gameInfo:gameInfo,
            requester:{
                name:name,
                id:socket.id
            }
        })
    }
    const handleOnClickMenu = () => {
        dispatch({ type:"set", field:"resultVisible", payload:false })
        socket.emit("leave room request", gameInfo.roomID)
        navigate('/menu')
    }
    React.useEffect(()=>{
        socket.on('other user left',()=>{
            setPlayAgainVisible(false)
        })
    },[])
    return (resultVisible?
        <div
            className="absolute top-0 bottom-0 left-0 right-0 w-1/2 h-1/2 text-white
            text-2xl bg-slate-800 rounded-lg p-5 z-50 flex m-auto">
            <div className="m-auto">
                The winner is {
                    (scores[0] > scores[1])?
                    users[0].name:users[1].name
                } !
                <div>{users[0].name} score: {scores[0]}</div>
                <div>{users[1].name} score: {scores[1]}</div>
                <RematchStatus />
                <div className="flex">
                    {playAgainVisible &&
                        <button
                            onClick={handleOnClickPlayAgain}
                            className="bg-green-600 text-white p-5 rounded-lg text-xl"
                        >
                            Play Again
                        </button>
                    }
                    <button
                        onClick={handleOnClickMenu}
                        className="bg-slate-600 text-white p-5 rounded-lg text-xl"
                    >
                        Back to menu
                    </button>
                </div>
            </div>
        </div>:null
    )
}

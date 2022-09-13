import React from 'react'
import { useNavigate } from 'react-router-dom'
import { GlobalContext } from '../states'

export default function Result() {
    const { global_state } = React.useContext(GlobalContext)
    const { users, scores } = global_state['gameInfo']
    const navigate = useNavigate()
    const handleOnClick = () => {
        navigate('/menu')
    }
    return (
        <div className="text-white text-2xl">
            The winner is {
                (scores[0] > scores[1])?
                users[0].name:users[1].name
            }
            <div>{users[0].name} score: {scores[0]}</div>
            <div>{users[1].name} score: {scores[1]}</div>
            <button
                onClick={handleOnClick}
                className="bg-slate-600 text-white p-5 rounded-lg text-xl"
            >
                Back to menu
            </button>
        </div>
    )
}

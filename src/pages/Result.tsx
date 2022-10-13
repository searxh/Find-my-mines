import React from 'react'
import { useNavigate } from 'react-router-dom'
import { GlobalContext } from '../states'

export default function Result() {
    const { global_state, dispatch } = React.useContext(GlobalContext)
    const { resultVisible } = global_state
    const { users, scores } = global_state['gameInfo']
    const navigate = useNavigate()
    const handleOnClick = () => {
        dispatch({ type:"set", field:"resultVisible", payload:false })
        navigate('/menu')
    }
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
                <button
                    onClick={handleOnClick}
                    className="bg-slate-600 text-white p-5 rounded-lg text-xl"
                >
                    Back to menu
                </button>
            </div>
        </div>:null
    )
}

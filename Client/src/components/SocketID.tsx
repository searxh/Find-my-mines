import React from 'react'
import { GlobalContext } from '../states'

export default function SocketID() {
    const { global_state } = React.useContext(GlobalContext)
    const { socketID } = global_state
    return (
        <div className="p-5 text-white">
            Socket ID: {socketID}
        </div>
    )
}

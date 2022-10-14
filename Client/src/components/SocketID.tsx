import React from 'react'
import { GlobalContext } from '../states'

export default function SocketID() {
    const { global_state } = React.useContext(GlobalContext)
    React.useEffect(()=>{
        if (global_state['socket'] !== undefined) {
            console.log(global_state['socket'])
        }
    },[])
    return (
        <div className="p-5 bg-red-700 text-white">
            Socket ID: {global_state['socket'].id}
        </div>
    )
}

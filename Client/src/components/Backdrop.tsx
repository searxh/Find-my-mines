import React from 'react'
import { GlobalContext } from '../states'

export default function Backdrop() {
    const { global_state } = React.useContext(GlobalContext)
    const { flags } = global_state
    return (flags.resultVisible?
        <div className="absolute top-0 left-0 
        w-screen h-screen z-20 bg-black opacity-80" />
    :null
    )
}

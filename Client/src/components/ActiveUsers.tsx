import React from 'react'
import { GlobalContext } from '../states'

export default function ActiveUsers() {
    const { global_state } = React.useContext(GlobalContext)
    const { activeUsers } = global_state
    return (
        <div className="flex-1">
           <div className="flex flex-col text-xl">
                {Object.keys(activeUsers).length !== 0 && Object.keys(activeUsers).map((name:any)=>{
                    return (
                        <div className="flex justify-between text-green-400 p-2 
                        bg-neutral-800 rounded-full my-2 shadow-md">
                            <div className="h-3 w-3 bg-green-400 rounded-full my-auto mr-2"/>
                            <div>{name.toString()}</div>
                            <div/>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

import React from 'react'
import { UserType } from '../types';
import { getUserColor } from '../lib/utility/GetUserColor'

interface UserScorePropsType {
    name:string;
    score:number;
    isPlaying:boolean;
    activeUsers:Array<UserType>
    className?:string;
}

export default function UserScore({ 
    name,
    score, 
    isPlaying,
    className,
    activeUsers,
}:UserScorePropsType) {
    return (
        <div 
            className={`text-2xl text-white w-[70%] py-3 m-auto rounded-full
            shadow-md ${className}`}
            style={{
                background:`${isPlaying?"linear-gradient(to left, rgb(80,80,90), "+getUserColor(activeUsers,name)+")":""}`,
                backgroundColor:`${isPlaying?"":"rgb(70,70,80)"}`
            }}
        >
            {name.toUpperCase()}'S SCORE : {score}
        </div>
    )
}

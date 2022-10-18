import React from 'react'

interface UserScorePropsType {
    name:string;
    score:number;
    isPlaying:boolean;
    className?:string;
}

export default function UserScore({ 
    name,
    score, 
    isPlaying,
    className
}:UserScorePropsType) {
    return (
        <div className={`text-2xl text-white bg-gradient-to-l w-[70%] py-3 m-auto rounded-full
        ${isPlaying?"from-pink-500 to-cyan-500":"bg-neutral-500"} shadow-md ${className} `}>
            {name.toUpperCase()}'S SCORE : {score}
        </div>
    )
}

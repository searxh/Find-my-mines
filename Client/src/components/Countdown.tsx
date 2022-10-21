import React from 'react'

interface CountdownPropsType {
    seconds:number;
    trigger:boolean;
    callback:Function;
}

export default function Countdown({ seconds, trigger, callback }:CountdownPropsType) {
    const [ countdown, setCountdown ] = React.useState<number>(seconds);
    React.useEffect(()=>{
        if (trigger) {
            setTimeout(()=>setCountdown(countdown-1),1000);
        } else {
            callback();
            setCountdown(seconds);
        }
    },[countdown,trigger])
    return (
        <> {countdown} </>
    )
}

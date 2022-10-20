import React from 'react'

interface CountdownPropsType {
    trigger:boolean;
    callback:Function;
}

export default function Countdown({ trigger, callback }:CountdownPropsType) {
    const [ countdown, setCountdown ] = React.useState<number>(15);
    React.useEffect(()=>{
        if (trigger) {
            setTimeout(()=>setCountdown(countdown-1),1000);
        } else {
            callback();
            setCountdown(15);
        }
    },[countdown,trigger])
    return (
        <> {countdown} </>
    )
}

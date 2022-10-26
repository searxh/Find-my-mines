import React from 'react'
import { addSeconds, differenceInSeconds } from 'date-fns'

interface CountdownPropsType {
    seconds:number;
    trigger:boolean;
    callback:Function;
}

export default function Countdown({ 
    seconds, trigger, callback
}:CountdownPropsType) {
    const [ endTime, setEndTime ] = React.useState<Date>(addSeconds(Date.now(),seconds));
    const [ countdown, setCountdown ] = React.useState<number>(seconds);
    const [ start, setStart ] = React.useState<boolean>(false);
    React.useEffect(()=>{
        if (trigger) {
            setStart(true);
            setEndTime(addSeconds(Date.now(),seconds));
        } else {
            setStart(false);
        }
    },[trigger])
    React.useEffect(()=>{
        let interval:any = null;
        if (start) {
            interval = setInterval(()=>{
                const diff = differenceInSeconds(endTime,Date.now());
                if (diff > 0) {
                    setCountdown(diff);
                } else {
                    setStart(false);
                    callback();
                    setCountdown(seconds);
                }
            },500)
        }
        return ()=>clearInterval(interval);
    },[start]);
    return (
        <>{countdown}</>
    )
}

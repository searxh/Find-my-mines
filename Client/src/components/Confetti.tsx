import React from 'react'

interface ConfettiPropsType {
    trigger:boolean;
}

export default function Confetti({ trigger }:ConfettiPropsType) {
    const [ visible, setVisible ] = React.useState<boolean>(false);
    const [ transition, setTransition ] = React.useState<boolean>(false);
    React.useEffect(()=>{
        if (trigger) {
            setVisible(true);
            setTimeout(()=>setVisible(false),1500);
        }
    },[trigger])
    React.useEffect(()=>{
        if (visible) {
            setTimeout(()=>setTransition(true),100);
            setTimeout(()=>setTransition(false),1450);
        }
    },[visible])
    return (
        visible?
            <img
                className={`absolute flex z-10 w-screen h-screen object-contain
                ${transition?"scale-100":"scale-0"} duration-[50ms]`}
                src="/assets/images/confetti.webp"
                alt=""
            />
        :null
    )
}

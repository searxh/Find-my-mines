import React from 'react'

export default function Image({ type, className }:{ type:string, className?:string }) {
    const [image,setImage] = React.useState<string | undefined>(undefined);
    React.useLayoutEffect(()=>{
        if (type !== undefined && type !== null) {
            setImage("assets/images/"+type+"Mine.png");
        }
    },[type])
    return (
        type !== null?
        <img 
            src={image}
            className={`w-full object-contain ${className} `}
            alt=""
        />
        :null
    )
}
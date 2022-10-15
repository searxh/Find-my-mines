import { Socket } from "socket.io-client"
export interface MessageType {
    from:string,
    message:string,
    at:string | number
}
export interface BlockType {
    selected:boolean,
    value:number
}
export interface UserType {
    name:string,
    id:string
}
export interface GameInfoType {
    roomID:string,
    timer:number,
    users:Array<UserType>,
    playingUser:number,
    scores:Array<number>,
    minesArray:Array<BlockType>,
}
export interface GlobalStateKeys {
    [key:string]: any
}
export interface GlobalStateType extends GlobalStateKeys {
    name:string
    chatHistory:Array<MessageType>,
    activeUsers:any,
    gameInfo:GameInfoType,
    resultVisible:boolean,
    connected:boolean,
    flags:{
        setRematchStatus:boolean
    }
}
export interface ActionType {
    type:string
    field?:string | Array<string>
    payload:any
}
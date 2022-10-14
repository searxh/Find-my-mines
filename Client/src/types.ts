import { Socket } from "socket.io-client"
export interface MessageType {
    from:string,
    message:string,
    at:string
}
export interface BlockType {
    selected:boolean,
    value:number
}
export interface UserType {
    name:string,
    id:number
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
    [key:string]:string | boolean | Socket | Array<MessageType> | Array<UserType> | GameInfoType
}
export interface GlobalStateType extends GlobalStateKeys {
    name:string
    socket:Socket,
    chatHistory:Array<MessageType>,
    activeUsers:Array<UserType>,
    gameInfo:GameInfoType,
    resultVisible:boolean,
}
export interface ActionType {
    type:string
    field?:string | Array<string>
    payload:any
}
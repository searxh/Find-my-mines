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
export interface CounterType {
    roomID:string,
    countdown: ReturnType<typeof setInterval> | boolean
}
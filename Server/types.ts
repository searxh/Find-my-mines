
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
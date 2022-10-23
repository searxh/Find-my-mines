import { Dispatch } from "react";
import { Socket } from "socket.io-client";
export interface MessageType {
	from: string;
	message: string;
	at: string | number;
}
export interface BlockType {
	selected: boolean;
	value: number;
	selectedBy: string;
	type: string | null;
}
export interface UserType {
	name: string;
	id: string;
	inGame: boolean;
}
export interface InviteStorageType {
	senderName:string;
}
export interface PriorityType {
	name: string;
	id: string;
	inGame: boolean;
	priority: number;
}
export interface InviteInfoType {
	senderName?:string;
	roomID?:string,
	error?:boolean,
}
export interface GameInfoType {
	roomID: string;
	timer: number;
	users: Array<UserType>;
	playingUser: number;
	scores: Array<number>;
	minesArray: Array<BlockType>;
}
export interface FlagsType {
	userLeft: boolean;
	resultVisible: boolean;
	isMatching: boolean;
}
export interface GlobalStateKeys {
	[key: string]: any;
}
export interface GlobalStateType extends GlobalStateKeys {
    name:string;
    chatHistory:Array<MessageType>;
    activeUsers:Array<UserType>;
	receiver: any;
    gameInfo:GameInfoType;
    socketID:string;
    flags:FlagsType;
}
export interface ActionType {
	type: string;
	field?: string | Array<string>;
	payload: any;
}
export interface SocketContextType {
	socket: Socket;
	setSocket: Dispatch<Socket>;
}
export interface GlobalContextType {
	global_state: GlobalStateType;
	dispatch: Dispatch<ActionType>;
}

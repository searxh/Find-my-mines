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
	color: string;
}
export interface InviteStorageType {
	senderName: string;
	inviteMessage: string;
}
export interface InviteMessageType {
	message: string;
	ready: boolean;
}
export interface PriorityType {
	name: string;
	id: string;
	inGame: boolean;
	priority: number;
}
export interface InviteInfoType {
	senderName?: string;
	roomID?: string;
	inviteMessage?: string;
	error?: boolean;
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
	//shows whether active users are present in the server or not (sent from server)
	activeUsersInitialized: boolean;
	//controls if matching is allowed or not
	canMatch: boolean;
	//shows if the other user has left or not
	userLeft: boolean;
	//if the result should be visible has left or not
	resultVisible: boolean;
	//controls whether the user is matching or not
	isMatching: boolean;
	//controls whether confirmation component is visible or not
	confirmationVisible: boolean;
	//controls visibility of confetti
	confettiVisible: boolean;
	//shows if game is paused or not
	isPaused: boolean;
}
interface MinesLeftKey {
	[key: string]: number;
}
export interface MinesLeftType extends MinesLeftKey {
	legendary: number;
	epic: number;
	rare: number;
	common: number;
}
interface GlobalStateKeys {
	[key: string]: any;
}
export interface GlobalStateType extends GlobalStateKeys {
	name: string;
	chatHistory: Array<MessageType>;
	activeUsers: Array<UserType>;
	activeGames: Array<GameInfoType>;

	pendingInvite: {
		[key: string]: string;
	};
	receivedInvite: {
		[key: string]: boolean;
	};
	gameInfo: GameInfoType;
	socketID: string;
	flags: FlagsType;
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

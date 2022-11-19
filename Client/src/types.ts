import { Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";
export interface MinesConfigType {
    [key: string]: {
        points: number;
        amount: number;
    };
}
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
    gameOptions: {
        gridSize: number;
        minesConfig: MinesConfigType;
    };
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
    type: string;
    state: number;
    users: Array<UserType>;
    gridSize: number;
    winningScore: number;
    minesConfig: MinesConfigType;
    playingUser: number;
    scores: Array<number>;
    minesArray: Array<BlockType>;
}
export interface HowToPlayVisibleType {
    backButton: boolean;
    frontButton: boolean;
}
export interface EffectsType {
    gifSize: string;
    text: string;
    points: number;
}
export interface PersistentFlagsType {
    //controls whether user can auto name register or not
    //(allows auto name register in reconnection cases)
    canAutoNameRegister: boolean;
    //controls whether how to play should be active or not
    howToPlayIsActive: boolean;
    //shows whether the other user has left or not
    userLeft: boolean;
    //controls whether the result should be visible has left or not
    resultVisible: boolean;
    //shows whether the game is paused or not
    isPaused: boolean;
}
export interface FlagsType {
    //shows whether active users are present in the server or not (sent from server)
    activeUsersInitialized: boolean;
    //controls whether matching is allowed or not
    canMatch: boolean;
    //controls whether the user is matching or not
    isMatching: boolean;
    //controls whether confirmation component is visible or not
    confirmationVisible: boolean;
}
interface MinesLeftKey {
    [key: string]: number;
}
export interface MinesLeftType extends MinesLeftKey {
    Legendary: number;
    Epic: number;
    Rare: number;
    Common: number;
}
interface GlobalStateKeys {
    [key: string]: any;
}
export interface GlobalStateType extends GlobalStateKeys {
    name: string;
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
    persistentFlags: PersistentFlagsType;
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
export interface NavigateContextType {
    navigate: Function;
}

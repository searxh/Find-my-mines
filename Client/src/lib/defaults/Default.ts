import {
	InviteMessageType,
	MinesConfigType,
	GlobalStateType,
	GameInfoType,
} from "../../types";

export const initialState: GlobalStateType = {
	name: "",
	chatHistory: [],
	activeUsers: [],
	pendingInvite: {},
	receivedInvite: {},
	gameInfo: {} as GameInfoType,
	activeGames: [],
	socketID: "",
	flags: {
		activeUsersInitialized: false,
		canMatch: true,
		resultVisible: false,
		userLeft: false,
		isMatching: false,
		confirmationVisible: false,
		isPaused: false,
	},
};

export const defaultMinesConfig: MinesConfigType = {
	Legendary: {
		points: 700,
		amount: 1,
	},
	Epic: {
		points: 500,
		amount: 2,
	},
	Rare: {
		points: 300,
		amount: 3,
	},
	Common: {
		points: 200,
		amount: 5,
	},
};

export const initialMinesLeftObj = {
	legendary: 1,
	epic: 2,
	rare: 3,
	common: 5,
};

export const initialInviteMessage: InviteMessageType = {
	message: "",
	gameOptions: {
		gridSize: 36,
		minesConfig: defaultMinesConfig,
	},
	ready: false,
};

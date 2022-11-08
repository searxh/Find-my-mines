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
	persistentFlags: {
		canAutoNameRegister: false,
	},
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

export const defaultGridSizeInput = 6;

export const defaultGridSize = 36;

export const initialInviteMessage: InviteMessageType = {
	message: "",
	gameOptions: {
		gridSize: defaultGridSize,
		minesConfig: defaultMinesConfig,
	},
	ready: false,
};

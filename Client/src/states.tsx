import React from "react";
import { createContext } from "react";
import {
	ActionType,
	GameInfoType,
	GlobalContextType,
	GlobalStateType,
} from "./types";

export const GlobalContext = createContext<GlobalContextType>(
	{} as GlobalContextType
);

export const initialState: GlobalStateType = {
	name: "",
	chatHistory: [],
	activeUsers: [],
	pendingInvite: {},
	receivedInvite: {},
	gameInfo: {} as GameInfoType,
	socketID: "",
	flags: {
		activeUsersInitialized: false,
		canMatch: true,
		resultVisible: false,
		userLeft: false,
		isMatching: false,
		confirmationVisible: false,
		confettiVisible: false,
	},
};

const getSessionData = () => {
	const state = sessionStorage.getItem("fmm-state");
	if (state === null) {
		save(initialState);
		return initialState;
	} else {
		return load();
	}
};

const save = (state: GlobalStateType) => {
	sessionStorage.setItem("fmm-state", JSON.stringify(state));
};

const load = () => {
	const res = JSON.parse(sessionStorage.getItem("fmm-state") as string);
	//reset flags
	return { ...res, flags:initialState.flags }
};

export function GlobalStateProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const reducer = (state: GlobalStateType, action: ActionType) => {
		const newState = { ...state };
		switch (action.type) {
			case "set":
				if (action.field !== undefined) {
					newState[action.field as string] = action.payload;
					save(newState);
					return newState;
				} else {
					return action.payload;
				};
			case "multi-set":
				if (action.field !== undefined) {
					for (let i = 0; i < action.field.length; i++) {
						newState[action.field[i]] = action.payload[i];
					}
					save(newState);
					return newState;
				} else return state;
			case "timer":
				newState.gameInfo = { ...newState.gameInfo, timer: action.payload };
				save(newState);
				return newState;
			default:
				return state;
		}
	};
	const [ state, dispatch ] = React.useReducer(reducer, getSessionData());
	return (
		<GlobalContext.Provider value={{ 
			global_state: state, 
			dispatch: dispatch,
		}}>
			{children}
		</GlobalContext.Provider>
	);
}

import { InviteMessageType } from "../../types";
import { MinesConfigType } from "../../types";

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

export const initialInviteMessage: InviteMessageType = {
	message: "",
	gameOptions: {
		gridSize: 36,
		minesConfig: defaultMinesConfig,
	},
	ready: false,
};

import React, { createContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { GlobalContext } from "./states";
import {
	GameInfoType,
	MessageType,
	UserType,
	SocketContextType,
} from "./types";
import { io } from "socket.io-client";

export const SocketContext = createContext<SocketContextType>(
	{} as SocketContextType
);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
	const { global_state, dispatch } = React.useContext(GlobalContext);
	const { gameInfo, name, flags } = global_state;
	const [socket, setSocket] = React.useState<Socket | undefined>(undefined);
	const [reconnectInGame, setReconnectInGame] = React.useState<boolean>(false);
	const navigate = useNavigate();
	const location = useLocation();
	React.useEffect(() => {
		if (socket !== undefined) {
			socket.on("connect", () => {
				dispatch({
					type: "set",
					field: "socketID",
					payload: socket.id,
				});
				socket.emit("name register", {
					name: name,
					id: socket.id,
					inGame: false,
				});
			});
			socket.on("chat update", (chat: MessageType) => {
				dispatch({
					type: "set",
					field: "chatHistory",
					payload: chat,
				});
			});
			socket.on("active user update", (activeUsers: any) => {
				const users:Array<UserType> = Object.values(activeUsers)
				const newFlags = { ...flags, activeUsersInitialized:true };
				dispatch({
					type:"multi-set",
					field:["activeUsers","flags"],
					payload:[users, newFlags],
				})
			});
			socket.on("start game", (gameInfo: GameInfoType) => {
				const newFlags = { 
					...flags, 
					resultVisible: false,
					userLeft: false,
					isMatching: false,
			 	};
				dispatch({
					type: "multi-set",
					field: ["gameInfo", "flags","pendingInvite"],
					payload: [gameInfo, newFlags, {}],
				});
				setTimeout(() => navigate("/game"), 1000);
			});
			socket.on("gameInfo update", (gameInfo: GameInfoType) => {
				dispatch({
					type: "set",
					field: "gameInfo",
					payload: gameInfo,
				});
			});
			socket.on("counter", (timer: number) => {
				dispatch({
					type: "timer",
					payload: timer,
				});
			});
			socket.on("end game", (gameInfo: GameInfoType) => {
				dispatch({
					type: "set",
					field: "gameInfo",
					payload: gameInfo,
				});
				//delay showing results (to allow users to see last mine first)
				setTimeout(()=>{
					const newFlags = { ...flags, resultVisible: true };
					dispatch({
						type: "set",
						field: "flags",
						payload: newFlags,
					})
				},2000)
			});
			socket.on("other user left", () => {
				console.log("OTHER USER LEFT");
				const newFlags = { 
					...flags, 
					resultVisible: true, 
					userLeft: true
				};
				dispatch({
					type: "set",
					field: "flags",
					payload: newFlags,
				});
				//in the case where dispatch fails
				setTimeout(()=>{
					if (flags.resultVisible !== true && flags.userLeft !== true) {
						dispatch({
							type: "set",
							field: "flags",
							payload: newFlags,
						});
					}
				},500)
			});
		} else {
			setTimeout(() => {
				if (location.pathname.includes("game") && socket === undefined) {
					setSocket(io("http://" + process.env.REACT_APP_IP + ":9000"));
					setReconnectInGame(true);
				} else if (location.pathname.includes("menu") && socket === undefined) {
					console.log("setting socket");
					setSocket(io("http://" + process.env.REACT_APP_IP + ":9000"));
				}
			}, 300);
		}
	}, [socket, location.pathname]);
	React.useEffect(() => {
		if (reconnectInGame && socket !== undefined && flags.activeUsersInitialized) {
			console.log("attempting to reconnect game");
			socket.emit("reconnect game", { roomID: gameInfo.roomID });
			setReconnectInGame(false);
		}
	}, [reconnectInGame,flags.activeUsersInitialized]);
	return (
		<SocketContext.Provider
			value={{ socket: socket, setSocket: setSocket } as SocketContextType}
		>
			{children}
		</SocketContext.Provider>
	);
};

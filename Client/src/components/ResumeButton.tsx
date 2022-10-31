import React from "react";
import { SocketContext } from "../socket";
import { GlobalContext } from "../states";

export default function ResumeButton() {
	const { socket } = React.useContext(SocketContext);
	const { global_state } = React.useContext(GlobalContext);
	const { gameInfo, name } = global_state;
	const handleOnClick = () => {
		if (socket !== undefined) {
			socket.emit("pause/unpause", {
				roomID: gameInfo.roomID,
				requester: name,
			});
		}
	};
	return (
		<button
			onClick={handleOnClick}
			className="bg-neutral-500 p-2 text-xl rounded-full hover:scale-105 
            hover:bg-pink-700 duration-300 font-quicksand"
		>
			Resume
		</button>
	);
}

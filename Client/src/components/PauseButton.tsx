import React from "react";
import { playAudio } from "../lib/utility/Audio";
import { SocketContext } from "../socket";
import { GlobalContext } from "../states";

export default function PauseButton() {
	const { socket } = React.useContext(SocketContext);
	const { global_state } = React.useContext(GlobalContext);
	const { gameInfo, name } = global_state;
	const handleOnClick = () => {
		if (socket !== undefined) {
			socket.emit("pause/unpause", {
				roomID: gameInfo.roomID,
				requester: name,
			});
			playAudio("pop.wav");
		}
	};
	return (
		<button
			onClick={handleOnClick}
			className={`absolute flex right-0 left-0 -bottom-14 bg-yellow-600 rounded-full p-2 hover:scale-105 
            transition w-[30%] m-auto text-white text-lg font-righteous shadow-md
            justify-center`}
		>
			PAUSE
		</button>
	);
}

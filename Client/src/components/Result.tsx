import React from "react";
import { useNavigate } from "react-router-dom";
import RematchStatus from "./RematchStatus";
import { GlobalContext } from "../states";
import { SocketContext } from "../socket";

export default function Result() {
	const { global_state, dispatch } = React.useContext(GlobalContext);
	const { socket } = React.useContext(SocketContext);
	const { flags, gameInfo, name } = global_state;
	const { users, scores } = gameInfo;
	const [playAgainVisible, setPlayAgainVisible] = React.useState(true);
	const navigate = useNavigate();
	const handleOnClickPlayAgain = () => {
		if (socket !== undefined) {
			socket.emit("play again", {
				gameInfo: gameInfo,
				requester: {
					name: name,
					id: socket.id,
				},
			});
		}
	};
	const handleOnClickMenu = () => {
		if (socket !== undefined) {
			socket.emit("leave room request", gameInfo.roomID);
			const newFlags = { ...flags, resultVisible: false };
			dispatch({
				type: "multi-set",
				field: ["flags", "gameInfo"],
				payload: [newFlags, []],
			});
			setPlayAgainVisible(true);
			navigate("/menu");
		}
	};
	const checkWinner = (name: string) => {
		return getWinner() === name;
	};
	const getWinner = () => {
		return scores[0] > scores[1] ? users[0].name : users[1].name;
	};
	React.useEffect(() => {
		if (flags.userLeft) {
			setPlayAgainVisible(false);
			const newFlags = { ...flags, userLeft: false };
			dispatch({
				type: "set",
				field: "flags",
				payload: newFlags,
			});
		}
	}, [flags]);
	return flags.resultVisible ? (
		<div
			className={`absolute top-0 bottom-0 left-0 right-0 w-1/2 h-[70%] text-white
            text-2xl bg-gradient-to-t bg-neutral-800 rounded-3xl z-50 flex m-auto`}
		>
			<div className='m-auto w-[70%]'>
				<div
					className={`font-righteous text-5xl
                ${checkWinner(name) ? "text-green-400" : "text-red-400"} `}
				>
					{checkWinner(name) ? "VICTORY!" : "DEFEAT!"}
				</div>
				<div className='text-cyan-300 text-2xl'>
					{getWinner().toUpperCase()} WINS!
				</div>
				<div>
					{users[0].name}'s score: {scores[0]}
				</div>
				<div>
					{users[1].name}'s score: {scores[1]}
				</div>
				<RematchStatus />
				<div className='flex justify-evenly pt-10'>
					{playAgainVisible && (
						<button
							onClick={handleOnClickPlayAgain}
							className='basis-[40%] bg-green-700 text-white p-4
                            rounded-full text-xl hover:scale-105 transition'
						>
							PLAY AGAIN
						</button>
					)}
					<button
						onClick={handleOnClickMenu}
						className='basis-[40%] bg-red-700 text-white p-4
                        rounded-full text-xl hover:scale-105 transition'
					>
						LEAVE
					</button>
				</div>
			</div>
		</div>
	) : null;
}

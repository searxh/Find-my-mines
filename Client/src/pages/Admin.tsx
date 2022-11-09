import React, { useEffect, useState } from "react";
import Card from "../components/UIElements/Card";
import { GlobalContext } from "../states";
import SocketID from "../components/SocketID";
import { SocketContext } from "../socket";
import { GameInfoType } from "../types";
const Admin = () => {
	const { global_state } = React.useContext(GlobalContext);
	const { activeUsers, activeGames } = global_state;
	const [usersArray, setUsersArray] = useState<any[][]>([[]]);
	const { socket } = React.useContext(SocketContext);
	const [gamesArray, setGamesArray] = useState<any[]>([]);

	console.log(global_state);

	const resetHandler = (gameInfo: GameInfoType) => {
		socket.emit("admin reset game", gameInfo);
	};

	useEffect(() => {
		setUsersArray(
			Object.keys(activeUsers).map((key: any) => [key, activeUsers[key]])
		);
		setGamesArray(activeGames as any);
	}, [activeUsers, activeGames, global_state]);

	return (
		<>
			<div className='font-righteous text-6xl text-white text-center m-10'>
				ADMIN PAGE
			</div>
			<div className='flex justify-center gap-x-14  place-items-center '>
				<Card additionalStyle='w-80 '>
					<div className='text-slate-900'>
						<h1 className='text-3xl'>
							Current Users Online: {usersArray.length}
						</h1>

						{usersArray[0]?.length > 0 &&
							usersArray.map((user) => (
								<div key={Math.random()} className='mx-5'>
									<p className='text-2xl m-0'>{user[1].name}</p>
									<span className='flex p-2 bg-neutral-800 rounded-full my-2 shadow-md'>
										<span className='text-gray-50'>Status:</span>&nbsp;
										<span
											className={
												user[1].inGame ? "text-yellow-400" : "text-lime-400"
											}
										>
											{user[1].inGame ? "In Game" : "Online"}
										</span>
									</span>
								</div>
							))}
					</div>
				</Card>
				<Card additionalStyle='w-80 '>
					<div className='text-slate-900'>
						<h1 className='text-3xl'>Current Games: {gamesArray.length}</h1>

						{gamesArray.map((game) => (
							<span key={Math.random()}>
								<div className='p-2 bg-neutral-800 rounded text-slate-50 text-xl text-center'>
									<p>
										{game?.users[0]?.name} VS. {game?.users[1]?.name}
									</p>
									<span className='text-base'>
										<span className='flex p-2 bg-neutral-500 justify-between rounded-full my-0 shadow-md text-slate-50 '>
											<p className='my-1'>
												Current Scores: {game?.scores[0]} : {game?.scores[1]}
											</p>
											<button
												className='rounded-full bg-rose-400 p-1 hover:scale-105 transition
										hover:bg-pink-800 duration-500'
												onClick={() => {
													console.log("click");
													resetHandler(game);
												}}
											>
												RESET
											</button>
										</span>
										<span>
											Grid size: {Math.sqrt(game.gridSize)} X{" "}
											{Math.sqrt(game.gridSize)}
											<br />
											Mine Config
											<ul>
												{`Legendary: ${game.minesConfig.Legendary.amount}`}{" "}
												&emsp;
												{`Epic: ${game.minesConfig.Epic.amount}`}
											</ul>
											<ul>
												{`Rare: ${game.minesConfig.Rare.amount}`} &emsp;
												{`Common: ${game.minesConfig.Common.amount}`}
											</ul>
										</span>
									</span>
								</div>
							</span>
						))}
					</div>
				</Card>
			</div>
			<div className='flex justify-center my-20'>
				<SocketID />
			</div>
		</>
	);
};
export default Admin;

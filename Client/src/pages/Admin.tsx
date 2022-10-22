import React, { useEffect, useState } from "react";
import Card from "../components/UIElements/Card";
import { GlobalContext } from "../states";
import SocketID from "../components/SocketID";
const Admin = () => {
	const { global_state } = React.useContext(GlobalContext);
	const { activeUsers, gameInfo } = global_state;
	const [usersArray, setUsersArray] = useState<any[][]>([[]]);
	const [gamesArray, setGamesArray] = useState<any[][]>([[]]);

	console.log(Object.values(gameInfo)[0]);

	useEffect(() => {
		setUsersArray(
			Object.keys(activeUsers).map((key: any) => [key, activeUsers[key]])
		);
	}, [activeUsers, gameInfo, global_state]);
	console.log(usersArray);
	console.log(gamesArray);

	return (
		<div className='grid h-screen place-items-center'>
			<Card additionalStyle='w-80 '>
				<div className='text-slate-900'>
					<h1 className='text-2xl'>Current Users Online: 3</h1>

					{usersArray[0]?.length > 0 &&
						usersArray.map((user) => (
							<li key={Math.random()} className='mx-5'>
								{user[1].name} <br />
								<span>
									Status:&nbsp;&nbsp;
									<span
										className={
											user[1].inGame ? "text-yellow-400" : "text-lime-800"
										}
									>
										{user[1].inGame ? "In Game" : "Online"}
									</span>
								</span>
							</li>
						))}
				</div>
			</Card>
			<Card additionalStyle='w-80 '>
				<div className='text-slate-900'>
					<h1 className='text-2xl'>
						Current Games: {Object.keys(gameInfo).length}
					</h1>
					<li>
						{Object.values(gameInfo).map((u) => (
							<>
								{u.users[0].name} VS {u.users[1].name}
								&nbsp;&nbsp;
								{u.scores[0]} : {u.scores[1]}
							</>
						))}
					</li>
				</div>
			</Card>
			<SocketID />
		</div>
	);
};
export default Admin;

import React, { useEffect, useState } from "react";
import Card from "../components/UIElements/Card";
import { GlobalContext } from "../states";
import SocketID from "../components/SocketID";
const Admin = () => {
	const { global_state } = React.useContext(GlobalContext);
	const { activeUsers } = global_state;
	const [usersArray, setUsersArray] = useState<any[][]>([[]]);

	useEffect(
		() =>
			setUsersArray(
				Object.keys(activeUsers).map((key: any) => [key, activeUsers[key]])
			),

		[activeUsers, global_state]
	);
	console.log(usersArray);

	return (
		<div className='grid h-screen place-items-center'>
			<Card additionalStyle='w-80 '>
				<div className='text-slate-900'>
					<h1 className='text-2xl'>
						Current Users Online: {usersArray.length}
					</h1>

					{usersArray[0]?.length > 0 &&
						usersArray.map((user) => (
							<li key={Math.random()} className='mx-5'>
								{user[1].name} <br />
								<span>
									Status:&nbsp;&nbsp;
									<span
										className={user[1][2] ? "text-yellow-400" : "text-lime-800"}
									>
										{user[1][2] ? "In Game" : "Online"}
									</span>
								</span>
							</li>
						))}
				</div>
			</Card>
			<SocketID />
		</div>
	);
};
export default Admin;

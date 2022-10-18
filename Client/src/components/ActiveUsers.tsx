import React from "react";
import { GlobalContext } from "../states";
import { UserType } from "../types";

export default function ActiveUsers() {
	const { global_state } = React.useContext(GlobalContext);
	const { activeUsers } = global_state;
	return (
		<div className='flex-1 overflow-y-scroll'>
			<div className='flex flex-col text-xl'>
				{activeUsers.map((user: UserType) => {
					return (
						<div
							className={` flex justify-between ${
								user.inGame ? "text-yellow-400" : "text-green-400"
							} p-2 bg-neutral-800 rounded-full my-2 shadow-md`}
						>
							<div
								className={`h-3 w-3 ${
									user.inGame ? "bg-yellow-400" : "bg-green-400"
								} rounded-full my-auto mr-2`}
							/>
							<div>{user.name.toString()}</div>
							<div>{user.inGame ? "In-Game" : "Online"}</div>
							<div />
						</div>
					);
				})}
			</div>
		</div>
	);
}

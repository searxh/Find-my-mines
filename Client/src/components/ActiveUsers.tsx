import React, { useEffect } from "react";
import { GlobalContext } from "../states";
import { PriorityType, UserType } from "../types";
import InviteButton from "./InviteButton";

export default function ActiveUsers() {
	const { global_state } = React.useContext(GlobalContext);
	const { activeUsers } = global_state;
	useEffect(() => {}, [activeUsers]);

	return (
		<div className='flex-1 overflow-y-scroll'>
			<div className='flex flex-col text-xl'>
				{priorities.map((user: UserType) => {
					return (
						<div
							className={` flex justify-between ${
								user[2] ? "text-yellow-400" : "text-green-400"
							} p-2 
                            bg-neutral-800 rounded-full my-2 shadow-md`}
						>
							<div
								className={`h-3 w-3 ${
									user[2] ? "bg-yellow-400" : "bg-green-400"
								} rounded-full my-auto mr-2`}
							/>
							<div>{user[1].toString()}</div>
							<div>{user[2] ? "In Game" : "Online"}</div>
							<div />
						</div>
					);
				})}
			</div>
		</div>
	);
}

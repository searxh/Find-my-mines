import React from "react";
import { GlobalContext } from "../states";
import { PriorityType, UserType } from "../types";
import InviteButton from "./InviteButton";

export default function ActiveUsers() {
	const { global_state } = React.useContext(GlobalContext);
	const { activeUsers, name } = global_state;
	const [priorities, setPriorities] = React.useState<Array<PriorityType>>([]);
	React.useEffect(() => {
		if (activeUsers !== undefined) {
			const prioritiesArr = activeUsers.map((user: UserType) => {
				if (user.name === name) {
					return { ...user, priority: 1 };
				} else {
					return { ...user, priority: 0 };
				}
			});
			setPriorities(
				prioritiesArr.sort(
					(a: PriorityType, b: PriorityType) => b.priority - a.priority
				)
			);
		}
	}, [activeUsers]);
	return (
		<div className='flex-1 overflow-y-scroll'>
			<div className='flex flex-col text-xl'>
				{priorities.map((user: UserType) => {
					return (
						<div
							className={` flex justify-between ${
								user.inGame ? "text-yellow-400" : "text-green-400"
							} p-2 bg-neutral-800 rounded-full my-2 shadow-md`}
						>
							<div
								className={`h-4 w-4 ${
									user.inGame ? "bg-yellow-400" : "bg-green-400"
								} rounded-full my-auto mr-2`}
							/>
							<div className='my-auto'>{user.name.toString()}</div>
							<div className='my-auto'>
								{user.inGame ? "In-Game" : "Online"}
							</div>
							<InviteButton user={user} />
						</div>
					);
				})}
			</div>
		</div>
	);
}

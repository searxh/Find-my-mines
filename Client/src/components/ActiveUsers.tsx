import React from "react";
import { getUserColor } from "../lib/utility/GetUserColor";
import { GlobalContext } from "../states";
import { PriorityType, UserType } from "../types";
import InviteButton from "./InviteButton";

export default function ActiveUsers() {
	const { global_state } = React.useContext(GlobalContext);
	const { activeUsers, name } = global_state;
	const [ priorities, setPriorities ] = React.useState<Array<PriorityType>>([])
	React.useEffect(()=>{
		if (activeUsers !== undefined) {
			const prioritiesArr = activeUsers.map((user:UserType)=>{
				if (user.name === name) {
					return { ...user, priority:1 }
				} else {
					return { ...user, priority:0 }
				}
			})
			setPriorities(prioritiesArr.sort(
				(a:PriorityType,b:PriorityType)=>b.priority-a.priority
			))
		}
	},[activeUsers])
	return (
		<div className='flex-1 overflow-y-scroll'>
			<div className='flex flex-col text-xl'>
				{priorities.map((user: PriorityType) => {
					return (
						<div
							className={` flex justify-between ${
								user.inGame ? "text-yellow-400" : "text-green-400"
							} p-2 rounded-full my-2 shadow-lg bg-neutral-800 border-[1px]`}
							style={{
								borderColor:getUserColor(activeUsers,user.name)
							}}
						>
							<div
								className={`h-4 w-4 ${
									user.inGame ? "bg-yellow-400" : "bg-green-400"
								} rounded-full my-auto mr-2`}
							/>
							<div 
								style={{
									color:getUserColor(activeUsers,user.name)
								}}
								className="my-auto brightness-125 text-xl"
							>
								{user.name.toString().toUpperCase()}
							</div>
							<div className="my-auto text-lg">{user.inGame ? "IN-GAME" : "ONLINE"}</div>
							<InviteButton user={user} />
						</div>
					);
				})}
			</div>
		</div>
	);
}

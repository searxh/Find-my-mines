import React from "react";
import { useLocation } from "react-router-dom";
import { getUserColor } from "../lib/utility/GetUserColor";
import { SocketContext } from "../socket";
import { GlobalContext } from "../states";
import { PriorityType, UserType } from "../types";
import InviteButton from "./InviteButton";

export default function ActiveUsers() {
	const { global_state, dispatch } = React.useContext(GlobalContext);
	const { socket } = React.useContext(SocketContext);
	const { activeUsers, name } = global_state;
	const [ priorities, setPriorities ] = React.useState<Array<PriorityType>>([])
	const location = useLocation();
	React.useEffect(()=>{
		if (activeUsers !== undefined) {
			const prioritiesArr = activeUsers.map((user:UserType)=>{
				if (user.name === name) {
					return { ...user, priority:1 };
				} else {
					return { ...user, priority:0 };
				}
			})
			setPriorities(prioritiesArr.sort(
				(a:PriorityType,b:PriorityType)=>b.priority-a.priority
			))
		}
	},[activeUsers])
	React.useEffect(()=>{
		//in the case where active users fail to update
		if (socket !== undefined) {
			socket.emit("active user update",(activeUsers: any)=>{
				const users:Array<UserType> = Object.values(activeUsers)
				dispatch({
					type:"set",
					field:"activeUsers",
					payload:users,
				})
			});
			return ()=>socket.off("active user update") as any;
		}
	},[socket,location.pathname]);
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

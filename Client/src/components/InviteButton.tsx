import React from "react";
import { playAudio } from "../lib/utility/Audio";
import { SocketContext } from "../socket";
import { GlobalContext } from "../states";
import { InviteMessageType, PriorityType, UserType } from "../types";
import Countdown from "./Countdown";
import MessageTextArea from "./MessageTextArea";
import { initialInviteMessage } from "../lib/defaults/Default";

interface InviteButtonPropsType {
	user: PriorityType;
	className?: string;
}

export default function InviteButton({
	user,
	className,
}: InviteButtonPropsType) {
	const { global_state, dispatch } = React.useContext(GlobalContext);
	const { socket } = React.useContext(SocketContext);
	const { activeUsers, name, flags, receivedInvite, pendingInvite } =
		global_state;
	const [trigger, setTrigger] = React.useState<boolean>(false);
	const [inviteMessage, setInviteMessage] =
		React.useState<InviteMessageType>(initialInviteMessage);
	const [messageTextAreaVisible, setMessageTextAreaVisible] =
		React.useState<boolean>(false);
	//to make callback use the latest pendingInvite value
	const pendingInviteRef = React.useRef<any>();
	pendingInviteRef.current = pendingInvite;

	const handleOnClick = () => {
		playAudio("pop.wav");
		setMessageTextAreaVisible(true);
	};
	const checkCanInvite = () => {
		return (
			!activeUsers.find((activeUser: UserType) => activeUser.name === user.name)
				?.inGame && !flags.isMatching
		);
	};
	React.useEffect(() => {
		if (inviteMessage.ready) {
			socket.emit("invite request", {
				senderName: name,
				receiverName: user.name,
				inviteMessage: inviteMessage.message,
			});
			setTrigger(true);
			const newFlags = {
				...flags,
				canMatch: false,
				sendInvite: false,
			};
			const newPendingInvite = { ...pendingInvite };
			newPendingInvite[user.name] = user.name;
			dispatch({
				type: "multi-set",
				field: ["flags", "pendingInvite"],
				payload: [newFlags, newPendingInvite],
			});
			setInviteMessage(initialInviteMessage);
		}
	}, [inviteMessage.ready]);
	React.useEffect(() => {
		console.log("RECEIVED INVITES", Object.keys(receivedInvite));
		if (Object.keys(receivedInvite).length !== 0) {
			const check = receivedInvite[user.name];
			console.log(check);
			if (check !== undefined) {
				setTrigger(false);
				const newReceivedInvite = { ...receivedInvite };
				delete newReceivedInvite[user.name];
				console.log("i got a reply, removing pending invite for", user.name);
				const newPendingInvite = { ...pendingInvite };
				delete newPendingInvite[user.name];
				dispatch({
					type: "multi-set",
					field: ["receivedInvite", "pendingInvite"],
					payload: [newReceivedInvite, newPendingInvite],
				});
			}
		}
	}, [receivedInvite]);
	React.useEffect(() => {
		console.log("PENDING INVITES", Object.keys(pendingInvite));
		if (Object.keys(pendingInvite).length === 0) {
			const newFlags = { ...flags, canMatch: true };
			dispatch({
				type: "set",
				field: "flags",
				payload: newFlags,
			});
		}
	}, [pendingInvite]);
	return user.name !== name ? (
		<>
			<MessageTextArea
				setInviteMessage={setInviteMessage}
				visible={messageTextAreaVisible}
				setMessageTextAreaVisible={setMessageTextAreaVisible}
			/>
			<div className="relative">
				<div
					className={`flex font-righteous absolute ${
						trigger ? "-translate-x-11" : "translate-x-0"
					} text-lg
            left-0 top-0 h-full p-1 pr-16 pl-5 text-white ${
							checkCanInvite() ? "bg-green-600" : "opacity-0"
						} 
            text-center z-10 w-full rounded-full transition-transform duration-100 shadow-md ${className}`}
				>
					<Countdown
						seconds={15}
						trigger={trigger}
						callback={() => {
							setTrigger(false);
							const newPendingInvite = { ...pendingInviteRef.current };
							console.log("expired, deleting", user.name, newPendingInvite);
							delete newPendingInvite[user.name];
							dispatch({
								type: "set",
								field: "pendingInvite",
								payload: newPendingInvite,
							});
						}}
					/>
				</div>
				<button
					disabled={!checkCanInvite()}
					className={`relative flex px-3 py-1 justify-evenly hover:scale-110 transition rounded-full
                ${
									checkCanInvite()
										? "bg-green-800"
										: "opacity-70 bg-neutral-500"
								} text-lg z-20`}
					onClick={handleOnClick}
				>
					<div className="text-white">Invite</div>
					<svg
						className="fill-white w-6 h-6 m-auto mx-2"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 640 512"
					>
						<path d="M352 128c0 70.7-57.3 128-128 128s-128-57.3-128-128S153.3 0 224 0s128 57.3 128 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM504 312V248H440c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V136c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H552v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
					</svg>
				</button>
			</div>
		</>
	) : (
		<div className="mx-5">[You]</div>
	);
}

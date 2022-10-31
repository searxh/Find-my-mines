import React, { FormEvent } from "react";
import { SocketContext } from "../socket";
import { GlobalContext } from "../states";
import { MessageType } from "../types";
import filter from "bad-words";

export default function ChatInput() {
	const { global_state } = React.useContext(GlobalContext);
	const { socket } = React.useContext(SocketContext);
	const { name, gameInfo } = global_state;
	const messageRef = React.useRef<any>(null);
	const handleOnSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (messageRef.current !== null) {
			const messageObj: MessageType = {
				message: new filter().clean(messageRef.current.value),
				from: name,
				at: Date.now(),
			};
			socket.emit("chat message", {
				msg: messageObj,
				name: name,
				roomID: gameInfo?.roomID,
			});
			messageRef.current.value = "";
		}
	};
	return (
		<form className="bg-neutral-800 rounded-full flex px-3 py-3 shadow-md">
			<input
				ref={messageRef}
				className="w-11/12 rounded-full bg-transparent text-white"
			/>
			<button className="w-1/12" onClick={(e: FormEvent) => handleOnSubmit(e)}>
				<svg
					className="w-7 fill-neutral-400"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 512 512"
				>
					<path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L277.3 424.9l-40.1 74.5c-5.2 9.7-16.3 14.6-27 11.9S192 499 192 488V392c0-5.3 1.8-10.5 5.1-14.7L362.4 164.7c2.5-7.1-6.5-14.3-13-8.4L170.4 318.2l-32 28.9 0 0c-9.2 8.3-22.3 10.6-33.8 5.8l-85-35.4C8.4 312.8 .8 302.2 .1 290s5.5-23.7 16.1-29.8l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
				</svg>
			</button>
		</form>
	);
}

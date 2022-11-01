import React, { Dispatch, SetStateAction } from "react";
import { InviteMessageType } from "../types";
import { playAudio } from "../lib/utility/Audio";
import filter from "bad-words";
import { defaultMinesConfig } from "../lib/defaults/Default";

interface MessageTextAreaPropsType {
	setInviteMessage: Dispatch<SetStateAction<InviteMessageType>>;
	visible: boolean;
	setPreInviteOptionsVisible: Dispatch<SetStateAction<boolean>>;
}

export default function PreInviteOptions({
	setInviteMessage,
	visible,
	setPreInviteOptionsVisible,
}: MessageTextAreaPropsType) {
	const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
	const handleOnClose = () => {
		playAudio("pop.wav");
		setPreInviteOptionsVisible(false);
	};
	const handleOnClick = () => {
		if (textAreaRef.current !== null) {
			setInviteMessage({
				message: new filter().clean(textAreaRef.current.value),
				gameOptions: {
					gridSize: 36,
					minesConfig: defaultMinesConfig,
				},
				ready: true,
			});
			textAreaRef.current.value = "";
			handleOnClose();
		}
	};
	return visible ? (
		<div
			className="absolute flex top-0 bottom-0 left-0 right-0 z-30
        bg-black bg-opacity-80 rounded-3xl p-4 w-[30%] h-1/2 m-auto"
		>
			<button
				onClick={handleOnClose}
				className="absolute -top-1 -left-1 w-10 h-10 bg-neutral-500 text-white
                text-center rounded-full font-righteous hover:scale-110 transition"
			>
				X
			</button>
			<div className="flex flex-1 flex-col m-auto h-full justify-evenly">
				<div className="text-green-400 text-3xl font-righteous mb-2">
					INVITE MESSAGE
				</div>
				<textarea
					placeholder="What do you want to say to the other player?"
					ref={textAreaRef}
					className="basis-[90%] bg-neutral-800 bg-opacity-90 text-white 
                    rounded-3xl p-5 resize-none mb-3 text-center"
				></textarea>
				<button
					className="basis-[10%] bg-green-600 p-2 rounded-full 
                    hover:scale-105 transition text-white text-xl text-center"
					onClick={handleOnClick}
				>
					Send Invite
				</button>
			</div>
		</div>
	) : null;
}

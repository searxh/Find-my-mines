import React from "react";
import { GlobalContext } from "../states";

export default function Pause() {
	const { global_state } = React.useContext(GlobalContext);
	const { flags } = global_state;
	return flags.isPaused ? (
		<div className="absolute flex z-30 text-white font-righteous text-6xl h-screen w-screen">
			<div className="flex flex-col m-auto">
				PAUSED
				<button
					className="bg-neutral-500 p-2 text-xl rounded-full hover:scale-105 
                    hover:bg-pink-700 duration-300 font-quicksand"
				>
					Resume
				</button>
			</div>
		</div>
	) : null;
}

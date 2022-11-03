import React from "react";
import { GlobalContext } from "../states";
import ResumeButton from "./ResumeButton";

export default function Pause() {
	const { global_state } = React.useContext(GlobalContext);
	const { flags } = global_state;
	return flags.isPaused ? (
		<div className="absolute flex z-30 text-white font-righteous text-6xl h-screen w-screen">
			<div className="flex flex-col m-auto">
				PAUSED
				<ResumeButton />
			</div>
		</div>
	) : null;
}

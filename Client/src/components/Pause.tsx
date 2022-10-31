import React from "react";
import { GlobalContext } from "../states";

export default function Pause() {
	const { global_state } = React.useContext(GlobalContext);
	const { flags } = global_state;
	return flags.isPaused ? (
		<div className="absolute z-30 text-white font-righteous text-5xl">
			PAUSED
		</div>
	) : null;
}

import React from "react";
import { default as Player } from "react-h5-audio-player";
import { useLocation } from "react-router-dom";

const trackList = {
	menu: "/assets/sounds/menu.mp3",
	inGame: "/assets/sounds/ingame.mp3",
};

export default function AudioPlayer() {
	const [mute, setMute] = React.useState<boolean>(true);
	const [track, setTrack] = React.useState<string>(trackList.menu);
	const location = useLocation();
	const ref = React.useRef<any>(null);
	const handleOnClick = () => {
		setMute(!mute);
		if (!mute) {
			ref.current?.audio.current.pause();
		} else {
			ref.current?.audio.current.play();
		}
	};
	React.useEffect(() => {
		if (location.pathname === "/game") {
			setTrack(trackList.inGame);
		} else {
			setTrack(trackList.menu);
		}
	}, [location.pathname]);
	return (
		<button
			onClick={handleOnClick}
			className={`absolute top-1 left-3 w-12 h-12 hover:scale-110 opacity-70
            ${
							mute
								? "bg-[url('../public/assets/images/mute.png')]"
								: "bg-[url('../public/assets/images/unmute.png')]"
						} 
            transition duration-300`}
		>
			<img
				className="m-auto"
				src={mute ? "assets/images/mute.png" : "assets/images/unmute.png"}
				alt=""
			/>
			<Player
				autoPlayAfterSrcChange={!mute}
				src={track}
				className="opacity-50 scale-[0.01%]"
				volume={0.2}
				loop={true}
				ref={ref}
			/>
		</button>
	);
}

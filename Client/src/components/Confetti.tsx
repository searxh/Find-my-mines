import React from "react";
import { SocketContext } from "../socket";

export default function Confetti() {
	const { socket } = React.useContext(SocketContext);
	const [visible, setVisible] = React.useState<boolean>(false);
	const [transition, setTransition] = React.useState<boolean>(false);
	React.useEffect(() => {
		if (visible) {
			setTimeout(() => setTransition(true), 100);
			setTimeout(() => setTransition(false), 1450);
		}
	}, [visible]);
	React.useEffect(() => {
		if (socket !== undefined) {
			socket.on("confetti from sender", () => {
				setVisible(true);
				setTimeout(() => setVisible(false), 1500);
			});
			return () => socket.off("confetti from sender") as any;
		}
	}, [socket]);
	return visible ? (
		<img
			className={`absolute flex z-10 w-screen h-screen object-contain
                ${transition ? "scale-100" : "scale-0"} duration-[50ms]`}
			src="/assets/images/confetti.webp"
			alt=""
		/>
	) : null;
}

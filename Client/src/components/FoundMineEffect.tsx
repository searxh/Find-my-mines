import React from "react";
import { defaultMinesConfig } from "../lib/defaults/Default";
import { EffectsType } from "../types";
interface FoundMineEffectPropsType {
	minesType: string | null;
	trigger: boolean;
}

export default function FoundMineEffect({
	minesType,
	trigger,
}: FoundMineEffectPropsType) {
	const [visible, setVisible] = React.useState<boolean>(false);
	const [transition, setTransition] = React.useState<boolean>(false);
	const [effects, setEffects] = React.useState<EffectsType>({
		gifSize: "",
		text: "",
		points: 100,
	});
	React.useEffect(() => {
		switch (minesType) {
			case "Legendary":
				setEffects({
					gifSize: "scale-[400%] left-4 top-3",
					text: "text-3xl text-yellow-500 -right-48",
					points: defaultMinesConfig["Legendary"].points,
				});
				break;
			case "Epic":
				setEffects({
					gifSize: "scale-[300%] left-4 top-3",
					text: "text-2xl text-red-500 -right-28",
					points: defaultMinesConfig["Epic"].points,
				});
				break;
			case "Rare":
				setEffects({
					gifSize: "scale-[200%] left-3 top-1",
					text: "text-xl text-cyan-400 -right-24",
					points: defaultMinesConfig["Rare"].points,
				});
				break;
			case "Common":
				setEffects({
					gifSize: "scale-[100%] left-1 top-1",
					text: "text-lg text-neutral-400 -right-20",
					points: defaultMinesConfig["Common"].points,
				});
				break;
			default:
				break;
		}
	}, []);
	React.useEffect(() => {
		if (trigger) {
			setVisible(true);
			setTimeout(() => setVisible(false), 1500);
		}
	}, [trigger]);
	React.useEffect(() => {
		if (visible) {
			setTimeout(() => setTransition(true), 100);
			setTimeout(() => setTransition(false), 1400);
		}
	}, [visible]);
	return visible && minesType !== null ? (
		<>
			<img
				className={`absolute brightness-150 z-20
                    aspect-square sepia ${effects.gifSize}`}
				src="/assets/images/found.gif"
				alt=""
			/>
			<div
				className={`absolute transition duration-[1000ms] brightness-150 z-20 drop-shadow-sm
                ${
									transition
										? "-translate-y-20 opacity-100 scale-100"
										: "translate-y-0 opacity-0 scale-50"
								} 
                font-righteous ${effects.text}`}
			>
				<div>{minesType.toUpperCase()} MINE!</div>
				<div>+{effects.points} points</div>
			</div>
		</>
	) : null;
}

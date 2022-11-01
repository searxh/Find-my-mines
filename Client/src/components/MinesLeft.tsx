import React from "react";
import { defaultMinesConfig } from "../lib/defaults/Default";
import { GlobalContext } from "../states";
import { BlockType, MinesConfigType, MinesLeftType } from "../types";
import Image from "./Image";

export default function MinesLeft() {
	const { global_state } = React.useContext(GlobalContext);
	const { gameInfo } = global_state;
	const getMinesAmountArray = (minesConfig: MinesConfigType) => {
		const minesLeftObj: MinesLeftType = {} as MinesLeftType;
		Object.keys(minesConfig).forEach(
			(key) => (minesLeftObj[key] = minesConfig[key].amount)
		);
		return minesLeftObj;
	};
	const [minesLeft, setMinesLeft] = React.useState<MinesLeftType>(
		getMinesAmountArray(gameInfo.minesConfig)
	);
	React.useEffect(() => {
		if (gameInfo.minesArray !== undefined) {
			const minesLeftObj: MinesLeftType =
				getMinesAmountArray(defaultMinesConfig);
			gameInfo.minesArray.forEach((block: BlockType) => {
				if (block.type !== null && block.selected) {
					minesLeftObj[block.type] = minesLeftObj[block.type] - 1;
				}
			});
			setMinesLeft(minesLeftObj);
		}
	}, [gameInfo.minesArray]);
	return (
		<div
			className="text-white px-5 pb-5 pt-1 text-lg rounded-3xl bg-zinc-600 
        bg-opacity-60 w-[70%] m-auto"
		>
			<div className="text-2xl pb-1 font-righteous text-zinc-200">
				MINES LEFT
			</div>
			<div className="bg-neutral-800 rounded-3xl p-3">
				<div
					className={`flex text-yellow-300 justify-between
                ${minesLeft.Legendary === 0 ? "brightness-50" : null}`}
				>
					<Image type="Legendary" className="w-fit h-10 m-auto" />
					<div className="flex-1 my-auto">Legendary Mine</div>
					<div className="my-auto">x{minesLeft.Legendary}</div>
				</div>
				<div
					className={`flex text-red-300 justify-between
                ${minesLeft.Epic === 0 ? "brightness-50" : null}`}
				>
					<Image type="Epic" className="w-fit h-10" />
					<span className="flex-1 my-auto">Epic Mine</span>
					<span className="my-auto">x{minesLeft.Epic}</span>
				</div>
				<div
					className={`flex text-cyan-300 justify-between
                ${minesLeft.Rare === 0 ? "brightness-50" : null}`}
				>
					<Image type="Rare" className="w-fit h-10" />
					<span className="flex-1 my-auto">Rare Mine</span>
					<span className="my-auto">x{minesLeft.Rare}</span>
				</div>
				<div
					className={`flex text-neutral-300 justify-between
                ${minesLeft.Common === 0 ? "brightness-50" : null}`}
				>
					<Image type="Common" className="w-fit h-10" />
					<span className="flex-1 my-auto">Common Mine</span>
					<span className="my-auto">x{minesLeft.Common}</span>
				</div>
			</div>
		</div>
	);
}

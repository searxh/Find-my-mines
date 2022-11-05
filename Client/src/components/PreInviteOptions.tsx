import React, { Dispatch, SetStateAction } from "react";
import { InviteMessageType, MinesConfigType, MinesLeftType } from "../types";
import { playAudio } from "../lib/utility/Audio";
import filter from "bad-words";
import {
	defaultGridSizeInput,
	defaultMinesConfig,
} from "../lib/defaults/Default";
import IncrementDecrementButton from "./IncrementDecrementButton";
import Image from "./Image";
import GridSizeButton from "./GridSizeButton";
interface PreInviteOptionsPropsType {
	setInviteOptions: Dispatch<SetStateAction<InviteMessageType>>;
	visible: boolean;
	setPreInviteOptionsVisible: Dispatch<SetStateAction<boolean>>;
}

export default function PreInviteOptions({
	setInviteOptions,
	visible,
	setPreInviteOptionsVisible,
}: PreInviteOptionsPropsType) {
	const getMinesAmountArray = (minesConfig: MinesConfigType) => {
		const minesLeftObj: MinesLeftType = {} as MinesLeftType;
		Object.keys(minesConfig).forEach(
			(key) => (minesLeftObj[key] = minesConfig[key].amount)
		);
		return minesLeftObj;
	};
	const [minesAmount, setMinesAmount] = React.useState<MinesLeftType>(
		getMinesAmountArray(defaultMinesConfig)
	);
	//maxLimit = 0 under limit, maxLimit = 1 at limit, maxLimit = 2 exceeded limit
	const [gridSizeInput, setGridSizeInput] =
		React.useState<number>(defaultGridSizeInput);
	const [maxLimit, setMaxLimit] = React.useState<number>(0);
	const gridSizeRef = React.useRef<HTMLInputElement>(null);
	const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
	const handleOnClose = () => {
		playAudio("pop.wav");
		setPreInviteOptionsVisible(false);
		setMinesAmount(getMinesAmountArray(defaultMinesConfig));
	};
	const handleOnClick = () => {
		if (textAreaRef.current !== null && gridSizeRef.current !== null) {
			const size = Number(gridSizeRef.current.value);
			const modifiedMinesConfig = { ...defaultMinesConfig };
			Object.keys(minesAmount).forEach((key) => {
				modifiedMinesConfig[key].amount = minesAmount[key];
			});
			setInviteOptions({
				message: new filter().clean(textAreaRef.current.value),
				gameOptions: {
					gridSize: size * size,
					minesConfig: modifiedMinesConfig,
				},
				ready: true,
			});
			textAreaRef.current.value = "";
			gridSizeRef.current.value = defaultGridSizeInput.toString();
			handleOnClose();
		}
	};
	const getTotalMines = () => {
		return (
			minesAmount.Legendary +
			minesAmount.Epic +
			minesAmount.Rare +
			minesAmount.Common
		);
	};
	const minesLimit = (gridSize: number) => {
		let maxcount = getTotalMines();
		if (maxcount === gridSize) {
			setMaxLimit(1);
		} else if (maxcount > gridSize) {
			setMaxLimit(2);
		} else setMaxLimit(0);
	};
	const handleOnChange = () => {
		console.log(maxLimit);
		if (gridSizeRef.current !== null) {
			minesLimit(
				Number(gridSizeRef.current.value) * Number(gridSizeRef.current.value)
			);
		}
	};
	React.useEffect(() => {
		console.log(maxLimit);
		if (gridSizeRef.current !== null) {
			minesLimit(
				Number(gridSizeRef.current.value) * Number(gridSizeRef.current.value)
			);
		}
	}, [minesAmount]);

	return visible ? (
		<div
			className="absolute flex top-0 bottom-0 left-0 right-0 z-30
        bg-black bg-opacity-80 rounded-3xl p-4 w-[50%] h-[80%] m-auto"
		>
			<button
				onClick={handleOnClose}
				className="absolute -top-1 -left-1 w-10 h-10 bg-neutral-500 text-white
                text-center rounded-full font-righteous hover:scale-110 transition"
			>
				X
			</button>
			<div className="flex flex-1 flex-col m-auto h-full justify-evenly">
				<div className="text-cyan-400 text-3xl font-righteous mb-2">
					INVITE OPTIONS
				</div>
				<div className="flex justify-evenly">
					<div className="w-[15%]" />
					<div className="w-[15%]">
						<div className="text-white">Grid size:</div>
						<GridSizeButton
							stateChangeCallback={(num: number) => {
								setGridSizeInput(num);
							}}
							initial={defaultGridSizeInput}
							min={2}
							max={10}
						/>
					</div>
					<div className="w-[15%]">
						<div className="text-white">Total mines:</div>
						<div className="flex rounded-full bg-opacity-50 bg-neutral-700 w-full p-0.5 my-0.5">
							<div className="m-auto">{getTotalMines()}</div>
						</div>
					</div>
				</div>
				<div className="p-3">
					{Object.keys(minesAmount).map((key) => {
						return (
							<div className="grid grid-cols-3 grid-flow-row justify-items-center">
								<Image type={key} className="w-fit h-10 m-auto" />
								<div className="text-base text-white m-auto">
									{key} Mine Amount
								</div>
								<IncrementDecrementButton
									stateChangeCallback={(num: number) => {
										const newMinesAmount = { ...minesAmount };
										newMinesAmount[key] = num;
										setMinesAmount(newMinesAmount);
									}}
									initial={minesAmount[key]}
									min={0}
									max={100}
									maxDisabled={Boolean(maxLimit)}
									className="flex rounded-full bg-opacity-50 bg-neutral-700 w-fit p-0.5 my-0.5"
									buttonClassName="w-7 h-7 rounded-full bg-neutral-300 hover:scale-110 
									transition duration-200 hover:bg-opacity-80 m-auto bg-opacity-20"
									textClassName="m-auto px-5"
									svgClassName="w-6 h-6 m-auto"
								/>
							</div>
						);
					})}
				</div>
				<textarea
					placeholder="What do you want to say to the other player?"
					ref={textAreaRef}
					className="basis-[90%] bg-neutral-800 bg-opacity-90 text-white 
                    rounded-3xl p-5 resize-none mb-3 text-center"
				></textarea>
				<button
					disabled={Boolean(maxLimit)}
					className={`basis-[10%] bg-green-600 p-2 rounded-full duration-300
                    hover:scale-[102%] hover:opacity-80 transition text-white text-xl text-center
					${maxLimit ? "bg-neutral-700" : null}`}
					onClick={handleOnClick}
				>
					Send Invite
				</button>
			</div>
		</div>
	) : null;
}

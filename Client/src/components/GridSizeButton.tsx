import React from "react";

interface GridSizeButtonPropsType {
	stateChangeCallback: Function;
	min: number;
	max: number;
	initial: number;
}

export default function GridSizeButton({
	stateChangeCallback,
	min,
	max,
	initial,
}: GridSizeButtonPropsType) {
	const [number, setNumber] = React.useState<number>(initial);
	const minMaxCheck = (num: number) => {
		return num >= min && num <= max;
	};
	const handleOnClick = (isIncrement: boolean) => {
		if (isIncrement) {
			if (minMaxCheck(number + 1)) setNumber(number + 1);
			else setNumber(max);
		} else {
			if (minMaxCheck(number - 1)) setNumber(number - 1);
			else setNumber(min);
		}
	};
	React.useEffect(() => {
		stateChangeCallback(number);
	}, [number]);
	return (
		<div className="flex rounded-full bg-opacity-50 bg-neutral-700 w-full p-0.5 my-0.5">
			<button
				onClick={() => handleOnClick(false)}
				className="hover:scale-125 transition"
			>
				<svg
					className="w-5 h-5 hover:fill-white fill-neutral-500"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 384 512"
				>
					<path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 278.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
				</svg>
			</button>
			<div className="flex w-full">
				<div className="m-auto">
					{number} x {number}
				</div>
			</div>

			<button
				onClick={() => handleOnClick(true)}
				className="hover:scale-125 transition"
			>
				<svg
					className="w-5 h-5 hover:fill-white fill-neutral-500"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 384 512"
				>
					<path d="M342.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L274.7 256 105.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
				</svg>
			</button>
		</div>
	);
}

import React from "react";

interface IncrementDecrementButtonPropsType {
	stateChangeCallback: Function;
	min: number;
	max: number;
	maxDisabled: boolean;
	initial: number;
	className?: string;
	buttonClassName?: string;
	textClassName?: string;
	svgClassName?: string;
}

export default function IncrementDecrementButton({
	stateChangeCallback,
	min,
	max,
	maxDisabled,
	initial,
	className,
	buttonClassName,
	textClassName,
	svgClassName,
}: IncrementDecrementButtonPropsType) {
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
		<div className={className}>
			<button
				disabled={maxDisabled}
				onClick={() => handleOnClick(true)}
				className={`${buttonClassName} ${
					maxDisabled ? "opacity-0" : "opacity-100"
				}`}
			>
				<svg
					className={svgClassName}
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 448 512"
				>
					<path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
				</svg>
			</button>
			<div className={textClassName}>{number}</div>
			<button onClick={() => handleOnClick(false)} className={buttonClassName}>
				<svg
					className={svgClassName}
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 448 512"
				>
					<path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
				</svg>
			</button>
		</div>
	);
}

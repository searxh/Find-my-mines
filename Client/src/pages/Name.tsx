import React, { FormEvent, useReducer } from "react";
import { GlobalContext } from "../states";
import { useNavigate } from "react-router-dom";

const inputReducer = (state: any, action: any) => {
	switch (action.type) {
		case "CHANGE":
			return {
				...state,
				value: action.val,
				isValid: action.val.length > 0,
			};

		case "TOUCHED":
			return {
				...state,
				isTouched: true,
			};

		default:
			return state;
	}
};

export default function Name() {
	const [inputState, dispatchReducer] = useReducer(inputReducer, {
		value: "",
		isValid: false,
	});

	const changeHandler = (event: any) => {
		dispatchReducer({
			type: "CHANGE",
			val: event.target.value,
		});
	};
	const touchHandler = () => {
		dispatchReducer({ type: "TOUCHED" });
	};
	const { dispatch } = React.useContext(GlobalContext);
	const navigate = useNavigate();
	const nameRef = React.useRef<HTMLInputElement>(null);
	const handleOnSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (nameRef.current !== null) {
			dispatch({
				type: "set",
				field: "name",
				payload: nameRef.current.value,
			});
			if (nameRef.current.value.toLocaleLowerCase() === "admin") {
				navigate("admin");
			} else {
				navigate("menu");
			}
			nameRef.current.value = "";
		}
	};
	return (
		<div className='flex bg-neutral-800 w-full h-screen p-5'>
			<form className='flex flex-col m-auto p-2'>
				<div className='relative mb-10'>
					<div className='font-allerta text-6xl text-white text-center animate-pulse-slow'>
						FIND MY MINES
						<div className='font-quicksand absolute left-0 right-0 top-20 text-3xl'>
							GROUP 6
						</div>
					</div>
				</div>
				<input
					placeholder='Enter Your Name'
					className={`rounded-full text-center p-2 font-quicksand text-white 
                     ${
												!inputState.isValid && inputState.isTouched
													? "bg-rose-500"
													: " bg-neutral-500"
											} placeholder-white shadow-md my-5
                    hover:bg-neutral-700 transition duration-[2000ms]`}
					ref={nameRef}
					onChange={changeHandler}
					onBlur={touchHandler}
					value={inputState.value}
				/>
				<div className='flex justify-center p-5'>
					<button
						className={`bg-green-600 text-white p-2 rounded-full 
                        font-quicksand w-1/2 shadow-md ${
													inputState.isValid &&
													inputState.isTouched &&
													" hover:scale-105 transition hover:bg-pink-800 duration-500"
												}`}
						onClick={(e: FormEvent) => handleOnSubmit(e)}
						disabled={!inputState.isValid && inputState.isTouched}
					>
						PLAY
					</button>
				</div>
			</form>
		</div>
	);
}

import React, { FormEvent } from "react";
import { GlobalContext } from "../states";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../socket";
import { initialState } from "../lib/defaults/Default";
import { io } from "socket.io-client";

export default function Name() {
	const { socket, setSocket } = React.useContext(SocketContext);
	const { global_state, dispatch } = React.useContext(GlobalContext);
	const { name, persistentFlags } = global_state;
	const navigate = useNavigate();
	const nameRef = React.useRef<HTMLInputElement>(null);
	const [lock, setLock] = React.useState<boolean>(false);
	const handleOnSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (nameRef.current !== null && socket === undefined) {
			setSocket(io("http://" + process.env.REACT_APP_IP + ":7070"));
			setLock(true);
			dispatch({
				type: "set",
				field: "name",
				payload: nameRef.current.value,
			});
		}
	};
	React.useEffect(() => {
		if (lock && socket !== undefined && name.length !== 0) {
			socket.emit("name probe", name);
			socket.on("name probe response", (nameExists: boolean) => {
				console.log("NAMEEXISTS", nameExists);
				if (nameExists) {
					console.log("user already exists");
					dispatch({
						type: "set",
						field: "name",
						payload: "",
					});
					setLock(false);
				} else {
					console.log("SEND NAME REGISTER", name);
					socket.emit("name register", {
						name: name,
						id: socket.id,
						inGame: false,
					});
					const newPersistentFlags = {
						...persistentFlags,
						canAutoNameRegister: true,
					};
					dispatch({
						type: "set",
						field: "persistentFlags",
						payload: newPersistentFlags,
					});
					if (nameRef.current?.value.toLocaleLowerCase() === "admin") {
						navigate("admin");
					} else {
						if (nameRef.current !== null) nameRef.current.value = "";
						navigate("menu");
					}
				}
			});
			return () => socket.off("name probe response") as any;
		} else if (!lock && socket !== undefined) {
			sessionStorage.setItem("fmm-state", JSON.stringify(initialState));
			dispatch({
				type: "set",
				payload: initialState,
			});
			if (socket !== undefined) {
				console.log("socket forcibly disconnected");
				socket.disconnect();
				setSocket(undefined as any);
				const newPersistentFlags = {
					...persistentFlags,
					canAutoNameRegister: false,
				};
				dispatch({
					type: "set",
					field: "persistentFlags",
					payload: newPersistentFlags,
				});
			}
		}
	}, [socket, lock, name]);
	return (
		<div className="flex bg-gradient-to-t from-transparent to-slate-700 w-full h-screen p-5">
			<div
				className="absolute top-0 botom-0 left-0 right-0 -z-10 bg-cover blur-sm
            bg-[url('../public/assets/images/bg.png')] flex-1 h-screen opacity-50"
			/>
			<form className="flex flex-col m-auto p-2">
				<div className="relative mb-10">
					<div className="font-righteous text-6xl text-white text-center animate-pulse-slow">
						FIND MY MINES
						<div className="font-quicksand absolute left-0 right-0 top-20 text-3xl">
							GROUP 6
						</div>
					</div>
				</div>
				<input
					placeholder="Enter Your Name"
					className="rounded-full text-center p-2 font-quicksand 
                    bg-neutral-500 text-white placeholder-white shadow-md my-5
                    hover:bg-neutral-700 transition duration-[2000ms]"
					ref={nameRef}
				/>
				<div className="flex justify-center p-5">
					<button
						className="bg-green-600 text-white p-2 rounded-full 
                        font-quicksand w-1/2 shadow-md hover:scale-105 transition
                        hover:bg-pink-800 duration-500"
						onClick={(e: FormEvent) => handleOnSubmit(e)}
					>
						PLAY
					</button>
				</div>
			</form>
		</div>
	);
}

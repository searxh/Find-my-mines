import React, { FormEvent } from "react";
import { GlobalContext } from "../states";
import { SocketContext } from "../socket";
import { NavigateContext } from "../lib/utility/Navigate";
import { initialState, ioString } from "../lib/defaults/Default";
import { io } from "socket.io-client";
import Image from "../components/Image";
import { PersistentFlagsType } from "../types";

export default function Name() {
    const { socket, setSocket } = React.useContext(SocketContext);
    const { global_state, dispatch } = React.useContext(GlobalContext);
    const { navigate } = React.useContext(NavigateContext);
    const { name, persistentFlags } = global_state;
    const nameRef = React.useRef<HTMLInputElement>(null);
    const inputClasses: Array<string> = [
        "rounded-full text-center p-2 font-quicksand bg-neutral-500 text-white placeholder-white shadow-md my-5 hover:bg-neutral-700 transition duration-[2000ms]",
        "rounded-full text-center p-2 font-quicksand bg-red-500 text-white placeholder-white shadow-md my-5",
    ];
    const buttonClasses = [
        "bg-green-600 text-white p-2 rounded-full font-quicksand w-1/2 shadow-lg hover:scale-105 transition hover:brightness-125 duration-500 hover:shadow-green-500",
        "bg-green-600 text-white p-2 rounded-full font-quicksand w-1/2",
    ];

    const errorText: Array<string> = [
        "Username already in use",
        "Username too long (Max 16 Characters)",
        "Name must not contain only whitespace",
    ];
    const [errorTxt, setErrorTxt] = React.useState("");
    const [buttonClass, setButtonClass] = React.useState(
        "bg-green-600 text-white p-2 rounded-full font-quicksand w-1/2 shadow-lg hover:scale-105 transition hover:brightness-125 duration-500 hover:shadow-green-500"
    );
    const [lock, setLock] = React.useState<boolean>(false);
    const [invalidClass, setInvalidClass] = React.useState<string>(
        inputClasses[0]
    );
    const [formInvalid, setFormInvalid] = React.useState<boolean>(false);
    const onChangeInputHandler = (e: any) => {
        const input = e.target.value;
        if (input.length > 0) {
            setInvalidClass(inputClasses[0]);
            setButtonClass(buttonClasses[0]);
            setFormInvalid(false);
        }
        if (input.length > 16) {
            setInvalidClass(inputClasses[1]);
            setFormInvalid(true);
            setButtonClass(buttonClasses[1]);
            setErrorTxt(errorText[1]);
        }
        if (!input.replace(/\s/g, "").length) {
            setInvalidClass(inputClasses[1]);
            setButtonClass(buttonClasses[1]);
            setFormInvalid(true);
            setErrorTxt(errorText[2]);
        }
    };

    const handleOnSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log(nameRef.current?.value, socket);
        if (nameRef.current !== null && socket === undefined) {
            setSocket(io(ioString));
            setLock(true);
            dispatch({
                type: "set",
                field: "name",
                payload: nameRef.current.value,
            });
        } else if (socket !== undefined) {
            socket.disconnect();
            setSocket(undefined as any);
        }
    };
    React.useEffect(() => {
        if (lock && socket !== undefined && name.length !== 0) {
            socket.emit("name probe", name.toLocaleLowerCase());
            socket.on("name probe response", (nameExists: boolean) => {
                console.log("locked");
                console.log("NAMEEXISTS", nameExists);
                if (nameExists) {
                    console.log("user already exists");
                    if (nameRef.current !== null) nameRef.current.value = "";
                    dispatch({
                        type: "set",
                        field: "name",
                        payload: "",
                    });
                    setLock(false);
                } else {
                    socket.emit("name register", {
                        name: name.toLocaleLowerCase(),
                        id: socket.id,
                        inGame: false,
                    });
                    const newPersistentFlags: PersistentFlagsType = {
                        ...persistentFlags,
                        canAutoNameRegister: true,
                    };
                    dispatch({
                        type: "set",
                        field: "persistentFlags",
                        payload: newPersistentFlags,
                    });
                    if (
                        nameRef.current?.value.toLocaleLowerCase() === "admin"
                    ) {
                        navigate("admin");
                    } else {
                        navigate("menu");
                    }
                }
            });
            return () => socket.off("name probe response") as any;
        } else if (!lock) {
            console.log("unlocked");
            sessionStorage.setItem("fmm-state", JSON.stringify(initialState));
            dispatch({
                type: "set",
                payload: initialState,
            });
            if (socket !== undefined) {
                console.log("socket forcibly disconnected");
                setFormInvalid(true);
                setErrorTxt(errorText[0]);
                setInvalidClass(inputClasses[1]);
                socket.disconnect();
                setSocket(undefined as any);
                const newPersistentFlags: PersistentFlagsType = {
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
                className="absolute top-0 botom-0 left-0 right-0 -z-10 bg-cover bg-center blur-sm
            bg-[url('../public/assets/images/bg.gif')] flex-1 h-screen opacity-50"
            />
            <Image
                type="Common"
                className="absolute w-1/2 top-0 left-0 bottom-0 right-0 m-auto -z-10 animate-spin-slow blur-sm"
            />
            <form className="flex flex-col m-auto p-2">
                <div className="relative mb-10 text-white text-center">
                    <div className="font-righteous text-6xl animate-pulse-slow drop-shadow-[5px_5px_0px_rgba(0,0,0,1)]">
                        FIND MY MINES
                    </div>
                    <div className="font-quicksand absolute left-0 right-0 top-20 text-3xl">
                        GROUP 6
                    </div>
                </div>
                <input
                    placeholder="Enter Your Name"
                    className={invalidClass}
                    onChange={onChangeInputHandler}
                    ref={nameRef}
                />
                {formInvalid && (
                    <h1 className="text-red-400 font-quicksand text-center">
                        {errorTxt}
                    </h1>
                )}
                <div className="flex justify-center p-5">
                    <button
                        className={buttonClass}
                        onClick={(e: FormEvent) => handleOnSubmit(e)}
                        disabled={formInvalid}
                    >
                        PLAY
                    </button>
                </div>
            </form>
        </div>
    );
}

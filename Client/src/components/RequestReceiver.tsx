import React from "react";
import { SocketContext } from "../socket";
import { GlobalContext } from "../states";
import { FlagsType, InviteInfoType, InviteStorageType } from "../types";
import Countdown from "./Countdown";
import { playAudio } from "../lib/utility/Audio";
import CloseButton from "./CloseButton";

export default function RequestReceiver() {
    const { socket }: any = React.useContext(SocketContext);
    const { global_state, dispatch } = React.useContext(GlobalContext);
    const { name, flags } = global_state;
    const [mode, setMode] = React.useState<number>(0);
    const [trigger, setTrigger] = React.useState<boolean>(false);
    //mode 0 = not visible
    //mode 1 = (sender) gets invitation request
    //mode 2 = error occured (ex:someone accepted before you can, in multi-inv)
    const [inviteStorage, setInviteStorage] = React.useState<InviteStorageType>(
        {
            senderName: "",
            inviteMessage: "",
        }
    );
    const handleOnClickDecision = (bool: boolean) => {
        playAudio("pop.wav");
        if (
            socket !== undefined &&
            inviteStorage.senderName + inviteStorage.senderName !== ""
        ) {
            socket.emit("invite reply", {
                senderName: inviteStorage.senderName,
                receiverName: name,
                decision: bool,
            });
            setMode(0);
        } else {
            console.log("error occured at invite onClick()");
        }
        const newFlags: FlagsType = { ...flags, canMatch: true };
        dispatch({
            type: "set",
            field: "flags",
            payload: newFlags,
        });
    };
    const handleOnClickClose = () => {
        playAudio("pop.wav");
        if (mode === 2) {
            setMode(0);
        } else {
            handleOnClickDecision(false);
        }
    };
    React.useEffect(() => {
        if (socket !== undefined) {
            console.log("listening for request");
            socket.on(
                "request incoming",
                ({
                    senderName,
                    roomID,
                    inviteMessage,
                    error,
                }: InviteInfoType) => {
                    playAudio("noti.wav");
                    console.log(senderName, roomID, inviteMessage, error);
                    if (
                        error === undefined &&
                        senderName !== undefined &&
                        roomID !== undefined &&
                        inviteMessage !== undefined
                    ) {
                        const newFlags: FlagsType = {
                            ...flags,
                            canMatch: false,
                        };
                        dispatch({
                            type: "set",
                            field: "flags",
                            payload: newFlags,
                        });
                        setInviteStorage({
                            senderName: senderName,
                            inviteMessage: inviteMessage,
                        });
                        setMode(1);
                        setTrigger(true);
                    } else {
                        console.log("undefined");
                        setMode(2);
                    }
                }
            );
            return () => socket.off("request incoming");
        }
    }, [socket]);
    return mode !== 0 ? (
        <div
            className="absolute top-0 bottom-0 left-0 right-0 w-[40%] h-[60%] text-white
                text-2xl bg-neutral-900 bg-opacity-90 rounded-3xl z-50 flex m-auto shadow-md"
        >
            <CloseButton onClick={handleOnClickClose} />
            {mode === 1 && (
                <div className="flex flex-col m-auto">
                    <div className="text-3xl font-righteous px-10 text-yellow-300">
                        YOU HAVE RECEIVED A GAME INVITATION
                    </div>
                    <div className="text-lg font-quicksand pt-2 px-16">
                        The game will start immediately after you accept,
                        otherwise this invite will expire in
                        <Countdown
                            seconds={15}
                            trigger={trigger}
                            callback={() => {
                                setTrigger(false);
                                const newFlags = { ...flags, canMatch: true };
                                dispatch({
                                    type: "set",
                                    field: "flags",
                                    payload: newFlags,
                                });
                                setMode(0);
                            }}
                        />
                        seconds
                    </div>
                    <div className="py-2 text-cyan-300">
                        Inviter: {inviteStorage.senderName}
                    </div>
                    <div
                        className="relative text-lg text-neutral-300 bg-neutral-800 bg-opacity-80 
                        h-24 overflow-y-scroll break-words p-5 rounded-3xl w-[70%] mx-auto no-scrollbar"
                    >
                        <div className="absolute top-0 bottom-0 right-0 left-0 p-5">
                            {inviteStorage.inviteMessage}
                        </div>
                    </div>
                    <div className="flex w-full justify-evenly pt-5">
                        <button
                            className="bg-green-800 px-8 py-2 text-white 
                                rounded-full hover:scale-105 transition"
                            onClick={() => handleOnClickDecision(true)}
                        >
                            Accept
                        </button>
                        <button
                            className="bg-pink-800 px-8 py-2 text-white 
                                rounded-full hover:scale-105 transition"
                            onClick={() => handleOnClickDecision(false)}
                        >
                            Decline
                        </button>
                    </div>
                </div>
            )}
            {mode === 2 && (
                <div className="m-auto">
                    <div className="text-4xl font-righteous px-10">
                        THE INVITATION IS ALREADY INVALID
                    </div>
                </div>
            )}
        </div>
    ) : null;
}

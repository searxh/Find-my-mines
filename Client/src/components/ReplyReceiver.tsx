import React from "react";
import { SocketContext } from "../socket";
import { GlobalContext } from "../states";
import { playAudio } from "../lib/utility/Audio";
import CloseButton from "./CloseButton";

export default function ReplyReceiver() {
    const { global_state, dispatch } = React.useContext(GlobalContext);
    const { socket }: any = React.useContext(SocketContext);
    const { receivedInvite } = global_state;
    const [mode, setMode] = React.useState<number>(0);
    //mode 0 = not visible
    //mode 1 = (sender) gets accepted or decline
    const [decision, setDecision] = React.useState<boolean>(false);
    const [receiverName, setReceiverName] = React.useState<string>("");
    const handleOnClickClose = () => {
        playAudio("pop.wav");
        setMode(0);
    };
    React.useEffect(() => {
        if (socket !== undefined) {
            socket.on(
                "reply incoming",
                ({
                    receiverName,
                    decision,
                }: {
                    receiverName: string;
                    decision: boolean;
                }) => {
                    console.log(receiverName, decision);
                    setDecision(decision);
                    setReceiverName(receiverName);
                    const newReceivedInvite = { ...receivedInvite };
                    newReceivedInvite[receiverName] = decision;
                    dispatch({
                        type: "set",
                        field: "receivedInvite",
                        payload: newReceivedInvite,
                    });
                    setMode(1);
                    playAudio("noti.wav");
                }
            );
            return () => socket.off("reply incoming");
        }
    }, [socket]);
    return mode !== 0 ? (
        <div
            className="absolute top-0 bottom-0 left-0 right-0 w-[30%] h-1/2 text-white
                text-2xl bg-neutral-900 bg-opacity-90 rounded-3xl z-50 flex m-auto shadow-md"
        >
            <CloseButton onClick={handleOnClickClose} />
            {mode === 1 && (
                <div className="m-auto">
                    <div
                        className={`text-3xl font-righteous px-10 ${
                            decision ? "text-green-400" : "text-red-400"
                        }`}
                    >
                        YOUR INVITATION WAS {decision ? "ACCEPTED" : "DECLINED"}
                    </div>
                    <div className="text-2xl text-cyan-400 font-quicksand px-10">
                        (Request sent to {receiverName})
                    </div>
                </div>
            )}
        </div>
    ) : null;
}

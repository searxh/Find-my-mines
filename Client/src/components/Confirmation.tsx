import React from "react";
import { playAudio } from "../lib/utility/Audio";
import { GlobalContext } from "../states";
import CloseButton from "./CloseButton";

interface ConfirmationPropsType {
    title: string;
    content: string;
    decisionCallback: Function;
}

export default function Confirmation({
    title,
    content,
    decisionCallback,
}: ConfirmationPropsType) {
    const { global_state } = React.useContext(GlobalContext);
    const { flags } = global_state;
    const [visible, setVisible] = React.useState<boolean>(false);
    const handleOnClickDecision = (decision: boolean) => {
        decisionCallback(decision);
        playAudio("pop.wav");
    };
    React.useEffect(() => {
        if (flags.confirmationVisible) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [flags]);
    return visible ? (
        <div
            className="absolute top-0 bottom-0 left-0 right-0 w-[30%] h-1/2 text-white
            text-2xl bg-neutral-900 bg-opacity-90 rounded-3xl z-50 flex m-auto shadow-md"
        >
            <CloseButton onClick={() => handleOnClickDecision(false)} />
            <div className="flex flex-col m-auto">
                <div className="text-3xl font-righteous px-10">{title}</div>
                <div className="text-lg font-quicksand py-8 px-12">
                    {content}
                </div>
                <div className="flex w-full justify-evenly">
                    <button
                        className="bg-green-800 px-8 py-2 text-white 
                        rounded-full hover:scale-105 transition"
                        onClick={() => handleOnClickDecision(true)}
                    >
                        Confirm
                    </button>
                    <button
                        className="bg-pink-800 px-8 py-2 text-white 
                        rounded-full hover:scale-105 transition"
                        onClick={() => handleOnClickDecision(false)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    ) : null;
}

import React from "react";
import { playAudio } from "../../lib/utility/Audio";
import CloseButton from "../CloseButton";

export const PopUp = (props: any) => {
    const [visible, setVisible] = React.useState<boolean>(true);
    const handleOnClose = () => {
        setVisible(false);
        props.onClose();
        playAudio("pop.wav");
    };
    return (
        <>
            {visible ? (
                <div
                    className="absolute flex top-0 bottom-0 left-0 right-0 z-30
        bg-black bg-opacity-80 rounded-3xl p-5 w-[50vw] h-[70vh] m-auto"
                >
                    <CloseButton onClick={handleOnClose} />
                    <div className="relative text-center flex flex-1">
                        {props.children}
                    </div>
                </div>
            ) : null}
        </>
    );
};

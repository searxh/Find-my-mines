import React from "react";
import { playAudio } from "../lib/utility/Audio";
import { NavigateContext } from "../lib/utility/Navigate";
import { GlobalContext } from "../states";
import { PersistentFlagsType } from "../types";

const ExtraButtons = () => {
    const { global_state, dispatch } = React.useContext(GlobalContext);
    const { persistentFlags } = global_state;
    const { navigate } = React.useContext(NavigateContext);
    const handleOnClickHowToPlay = () => {
        const newPersistentFlags: PersistentFlagsType = {
            ...persistentFlags,
            howToPlayIsActive: !persistentFlags.howToPlayIsActive,
        };
        dispatch({
            type: "set",
            field: "persistentFlags",
            payload: newPersistentFlags,
        });
        playAudio("pop.wav");
    };
    const handleOnClickExit = () => {
        navigate("root");
        playAudio("pop.wav");
    };
    return (
        <div className="absolute flex top-2 right-3 w-fit">
            <button
                onClick={handleOnClickHowToPlay}
                className="w-11 h-11 hover:scale-110 opacity-70 z-30 transition mx-2"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="fill-white"
                >
                    <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-114.7 0-208-93.31-208-208S141.3 48 256 48s208 93.31 208 208S370.7 464 256 464zM256 336c-18 0-32 14-32 32s13.1 32 32 32c17.1 0 32-14 32-32S273.1 336 256 336zM289.1 128h-51.1C199 128 168 159 168 198c0 13 11 24 24 24s24-11 24-24C216 186 225.1 176 237.1 176h51.1C301.1 176 312 186 312 198c0 8-4 14.1-11 18.1L244 251C236 256 232 264 232 272V288c0 13 11 24 24 24S280 301 280 288V286l45.1-28c21-13 34-36 34-60C360 159 329 128 289.1 128z" />
                </svg>
            </button>
            <button
                onClick={handleOnClickExit}
                className="w-11 h-11 hover:scale-110 opacity-70 z-30 transition mx-2"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512"
                    className="fill-white"
                >
                    <path d="M320 32c0-9.9-4.5-19.2-12.3-25.2S289.8-1.4 280.2 1l-179.9 45C79 51.3 64 70.5 64 92.5V448H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H96 288h32V480 32zM256 256c0 17.7-10.7 32-24 32s-24-14.3-24-32s10.7-32 24-32s24 14.3 24 32zm96-128h96V480v32h32 64c17.7 0 32-14.3 32-32s-14.3-32-32-32H512V128c0-35.3-28.7-64-64-64H352v64z" />
                </svg>
            </button>
        </div>
    );
};

export default ExtraButtons;

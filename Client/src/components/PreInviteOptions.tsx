import React, { Dispatch, SetStateAction } from "react";
import { InviteMessageType, MinesConfigType, MinesLeftType } from "../types";
import { playAudio } from "../lib/utility/Audio";
import filter from "bad-words";
import {
    defaultGridSizeInput,
    defaultMinesConfig,
} from "../lib/defaults/Default";
import IncrementDecrementButton from "./IncrementDecrementButton";
import Image from "./Image";
import GridSizeButton from "./GridSizeButton";
import CloseButton from "./CloseButton";
interface PreInviteOptionsPropsType {
    setInviteOptions: Dispatch<SetStateAction<InviteMessageType>>;
    visible: boolean;
    setPreInviteOptionsVisible: Dispatch<SetStateAction<boolean>>;
}

export default function PreInviteOptions({
    setInviteOptions,
    visible,
    setPreInviteOptionsVisible,
}: PreInviteOptionsPropsType) {
    const getMinesAmountArray = (minesConfig: MinesConfigType) => {
        const minesLeftObj: MinesLeftType = {} as MinesLeftType;
        Object.keys(minesConfig).forEach(
            (key) => (minesLeftObj[key] = minesConfig[key].amount)
        );
        return minesLeftObj;
    };
    const [minesAmount, setMinesAmount] = React.useState<MinesLeftType>(
        getMinesAmountArray(defaultMinesConfig)
    );
    //maxLimit = 0 under limit, maxLimit = 1 at limit,
    //maxLimit = 2 exceeded limit, maxLimit = 3 special case: mines = 0
    const [gridSizeInput, setGridSizeInput] =
        React.useState<number>(defaultGridSizeInput);
    const [maxLimit, setMaxLimit] = React.useState<number>(0);
    const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
    const handleOnClose = () => {
        playAudio("pop.wav");
        setPreInviteOptionsVisible(false);
        setMinesAmount(getMinesAmountArray(defaultMinesConfig));
    };
    const handleOnClick = () => {
        let msg =
            textAreaRef.current !== null && textAreaRef.current.value.length > 0
                ? new filter().clean(textAreaRef.current.value)
                : "";
        const modifiedMinesConfig = { ...defaultMinesConfig };
        Object.keys(minesAmount).forEach((key) => {
            modifiedMinesConfig[key].amount = minesAmount[key];
        });
        if (textAreaRef.current) textAreaRef.current.value = "";
        setInviteOptions({
            message: msg,
            gameOptions: {
                gridSize: gridSizeInput * gridSizeInput,
                minesConfig: modifiedMinesConfig,
            },
            ready: true,
        });
        handleOnClose();
    };
    const getTotalMines = () => {
        return (
            minesAmount.Legendary +
            minesAmount.Epic +
            minesAmount.Rare +
            minesAmount.Common
        );
    };
    const minesLimit = (gridSize: number) => {
        let maxcount = getTotalMines();
        if (maxcount === gridSize) {
            setMaxLimit(1);
        } else if (maxcount > gridSize) {
            setMaxLimit(2);
        } else if (maxcount === 0) {
            setMaxLimit(3);
        } else setMaxLimit(0);
    };
    React.useEffect(() => {
        minesLimit(gridSizeInput * gridSizeInput);
    }, [minesAmount, gridSizeInput]);

    return visible ? (
        <div
            className="absolute flex top-0 bottom-0 left-0 right-0 z-30 shadow-md
        bg-black bg-opacity-90 rounded-3xl p-4 w-[50%] h-[80%] m-auto"
        >
            <CloseButton onClick={handleOnClose} />
            <div className="flex flex-1 flex-col m-auto h-full justify-evenly">
                <div className="text-cyan-400 text-3xl font-righteous mb-2">
                    INVITE OPTIONS
                </div>
                <div className="grid grid-cols-3 grid-flow-row justify-items-center">
                    <div className="" />
                    <div className="">
                        <div className="text-white">Grid size:</div>
                        <GridSizeButton
                            stateChangeCallback={(num: number) => {
                                setGridSizeInput(num);
                            }}
                            initial={defaultGridSizeInput}
                            min={2}
                            max={10}
                        />
                    </div>
                    <div className="relative">
                        <div
                            className={`absolute -top-7 left-0 right-0 ${
                                maxLimit === 1
                                    ? "text-yellow-300"
                                    : maxLimit === 2
                                    ? "text-red-400"
                                    : null
                            }`}
                        >
                            {maxLimit === 1
                                ? "MAX"
                                : maxLimit === 2
                                ? "EXCEEDED"
                                : null}
                        </div>
                        <div className="text-white">Total mines:</div>
                        <div className="flex rounded-full bg-opacity-50 bg-neutral-700 w-full p-0.5 my-0.5">
                            <div
                                className={`m-auto ${
                                    maxLimit === 1
                                        ? "text-yellow-300"
                                        : maxLimit === 2
                                        ? "text-red-400"
                                        : null
                                }`}
                            >
                                {getTotalMines()}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-3">
                    {Object.keys(minesAmount).map((key) => {
                        return (
                            <div className="grid grid-cols-3 grid-flow-row justify-items-center">
                                <Image
                                    type={key}
                                    className="w-fit h-10 m-auto"
                                />
                                <div className="text-base text-white m-auto">
                                    Number of {key} Mines
                                </div>
                                <IncrementDecrementButton
                                    stateChangeCallback={(num: number) => {
                                        const newMinesAmount = {
                                            ...minesAmount,
                                        };
                                        newMinesAmount[key] = num;
                                        setMinesAmount(newMinesAmount);
                                    }}
                                    initial={minesAmount[key]}
                                    min={0}
                                    max={100}
                                    maxDisabled={
                                        Boolean(maxLimit) && maxLimit !== 3
                                    }
                                    className="flex rounded-full bg-opacity-50 bg-neutral-700 w-fit p-0.5 my-0.5"
                                    buttonClassName="w-7 h-7 rounded-full bg-neutral-300 hover:scale-110 
									transition duration-200 hover:bg-opacity-80 m-auto bg-opacity-20"
                                    textClassName="m-auto px-5"
                                    svgClassName="w-6 h-6 m-auto"
                                />
                            </div>
                        );
                    })}
                </div>
                <textarea
                    placeholder="What do you want to say to the other player?"
                    ref={textAreaRef}
                    className="basis-[90%] bg-neutral-800 bg-opacity-90 text-white 
                    rounded-3xl p-5 resize-none mb-3 text-center"
                ></textarea>
                <button
                    disabled={maxLimit >= 2}
                    className={`basis-[10%] bg-green-600 p-2 rounded-full duration-300 shadow-lg
                    hover:scale-[102%] hover:shadow-green-400 transition text-white text-xl text-center
					${maxLimit >= 2 ? "bg-neutral-700 opacity-50 hover:shadow-black" : null}`}
                    onClick={handleOnClick}
                >
                    Send Invite
                </button>
            </div>
        </div>
    ) : null;
}

import React from "react";
import RematchStatus from "./RematchStatus";
import { GlobalContext } from "../states";
import { SocketContext } from "../socket";
import { playAudio } from "../lib/utility/Audio";
import { NavigateContext } from "../lib/utility/Navigate";
import Countdown from "./Countdown";

export default function Result() {
    const { global_state } = React.useContext(GlobalContext);
    const { socket } = React.useContext(SocketContext);
    const { navigate } = React.useContext(NavigateContext);
    const { persistentFlags, gameInfo, name } = global_state;
    const { users, scores } = gameInfo;
    const [playAgainVisible, setPlayAgainVisible] = React.useState(true);
    const [kickNoticeVisible, setKickNoticeVisible] = React.useState(false);
    const handleOnClickPlayAgain = () => {
        if (socket !== undefined) {
            playAudio("pop.wav");
            socket.emit("play again", {
                gameInfo: gameInfo,
                requester: {
                    name: name,
                    id: socket.id,
                },
            });
        }
    };
    const handleOnClickMenu = () => {
        if (socket !== undefined) {
            playAudio("pop.wav");
            socket.emit("leave room request", gameInfo.roomID);
            navigate("menu");
        }
    };
    const checkWinner = (name: string) => {
        const res = getWinner();
        return res === undefined ? undefined : res === name;
    };
    const getWinner = () => {
        //if other user left mid-way
        if (
            persistentFlags.userLeft &&
            gameInfo.winningScore !== scores[0] + scores[1]
        ) {
            return name;
        } else {
            return scores[0] > scores[1]
                ? users[0].name
                : scores[0] < scores[1]
                ? users[1].name
                : undefined;
        }
    };
    React.useEffect(() => {
        if (persistentFlags.userLeft) {
            setPlayAgainVisible(false);
            setKickNoticeVisible(true);
        }
    }, [persistentFlags.userLeft]);
    return persistentFlags.resultVisible ? (
        <div
            className={`absolute top-0 bottom-0 left-0 right-0 w-1/2 h-[70%] text-white
            text-2xl bg-neutral-800 rounded-3xl z-50 flex m-auto`}
        >
            <div className="m-auto w-[70%]">
                <div
                    className={`font-righteous text-5xl
                ${
                    checkWinner(name) === undefined
                        ? "text-yellow-400"
                        : checkWinner(name)
                        ? "text-green-400"
                        : "text-red-400"
                } `}
                >
                    {checkWinner(name) === undefined
                        ? "DRAW!"
                        : checkWinner(name)
                        ? "VICTORY!"
                        : "DEFEAT!"}
                </div>
                <div className="text-cyan-300 text-2xl">
                    {getWinner()?.toUpperCase()}{" "}
                    {getWinner() !== undefined ? "WINS!" : null}
                </div>
                {!persistentFlags.userLeft && (
                    <>
                        <div>
                            {users[0].name}'s score: {scores[0]}
                        </div>
                        <div>
                            {users[1].name}'s score: {scores[1]}
                        </div>
                    </>
                )}
                <RematchStatus />
                {kickNoticeVisible && (
                    <div className="text-red-400 text-lg">
                        The room will automatically close in
                        <Countdown
                            seconds={10}
                            trigger={kickNoticeVisible}
                            callback={() => {
                                if (socket !== undefined) {
                                    socket.emit(
                                        "leave room request",
                                        gameInfo.roomID
                                    );
                                    navigate("menu");
                                }
                                console.log("go back to menu");
                                navigate("menu");
                            }}
                        />
                        seconds
                    </div>
                )}
                <div className="flex justify-evenly pt-10">
                    {playAgainVisible && (
                        <button
                            onClick={handleOnClickPlayAgain}
                            className="basis-[40%] bg-green-700 text-white p-4
                            rounded-full text-xl hover:scale-105 transition"
                        >
                            PLAY AGAIN
                        </button>
                    )}
                    <button
                        onClick={handleOnClickMenu}
                        className="basis-[40%] bg-red-700 text-white p-4
                        rounded-full text-xl hover:scale-105 transition"
                    >
                        LEAVE
                    </button>
                </div>
            </div>
        </div>
    ) : null;
}

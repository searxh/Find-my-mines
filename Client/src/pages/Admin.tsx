import React, { useEffect, useState } from "react";
import Card from "../components/UIElements/Card";
import { GlobalContext } from "../states";
import SocketID from "../components/SocketID";
import { SocketContext } from "../socket";
import { GameInfoType } from "../types";
import Image from "../components/Image";

const Admin = () => {
    const { global_state } = React.useContext(GlobalContext);
    const { activeUsers, activeGames } = global_state;
    const [usersArray, setUsersArray] = useState<any[][]>([[]]);
    const { socket } = React.useContext(SocketContext);
    const [gamesArray, setGamesArray] = useState<any[]>([]);

    console.log(global_state);

    const resetHandler = (gameInfo: GameInfoType) => {
        if (socket !== undefined) socket.emit("admin reset game", gameInfo);
    };
    const handleOnClickClearGlobalChat = () => {
        if (socket !== undefined) socket.emit("admin clear chat");
    };

    useEffect(() => {
        setUsersArray(
            Object.keys(activeUsers).map((key: any) => [key, activeUsers[key]])
        );
        setGamesArray(activeGames as any);
    }, [activeUsers, activeGames, global_state]);

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-slate-800 font-quicksand text-center">
            <div className="font-righteous text-4xl text-white pt-5">
                ADMIN CONSOLE
            </div>
            <button
                onClick={handleOnClickClearGlobalChat}
                className="mx-auto text-lg text-white bg-slate-600 hover:scale-105 transition 
                rounded-full w-fit px-5 py-1 hover:bg-rose-700"
            >
                CLEAR GLOBAL CHAT
            </button>
            <div className="flex justify-between text-white text-2xl text-center pb-2">
                <h1 className="basis-1/2">
                    CURRENT ONLINE USERS: {usersArray.length}
                </h1>
                <h1 className="basis-1/2">
                    CURRENT ACTIVE GAMES: {gamesArray.length}
                </h1>
            </div>
            <div className="flex justify-evenly flex-1">
                <Card additionalStyle="relative w-[45%] h-full bg-black bg-opacity-50 overflow-auto">
                    <div className="absolute text-white top-0 left-0 bottom-0 right-0 p-3">
                        {usersArray[0]?.length > 0 &&
                            usersArray.map((user) => (
                                <div
                                    key={Math.random()}
                                    className="flex justify-evenly my-2 bg-slate-700 rounded-xl"
                                >
                                    <p className="text-left text-xl m-auto px-5">
                                        <span className="text-blue-300 mr-2">
                                            Username:
                                        </span>
                                        {user[1].name}
                                        <p className="text-sm text-yellow-200">
                                            Socket ID: {user[1].id}{" "}
                                        </p>
                                    </p>
                                    <span className="flex p-2 px-5 bg-slate-800 rounded-full my-2 shadow-md m-auto">
                                        <div className="m-auto">
                                            <span className="text-gray-50">
                                                Status:
                                            </span>
                                            &nbsp;
                                            <span
                                                className={
                                                    user[1].inGame
                                                        ? "text-yellow-400"
                                                        : "text-lime-400"
                                                }
                                            >
                                                {user[1].inGame
                                                    ? "In Game"
                                                    : "Online"}
                                            </span>
                                        </div>
                                    </span>
                                </div>
                            ))}
                    </div>
                </Card>
                <Card additionalStyle="relative w-[45%] bg-black bg-opacity-50 overflow-auto">
                    <div className="absolute top-0 right-0 bottom-0 left-0 text-white p-3">
                        {gamesArray.map((game) => (
                            <span key={Math.random()}>
                                <div className=" bg-slate-700 rounded-xl text-slate-50 text-lg text-center my-2">
                                    <div className="text-left w-full bg-slate-600 rounded-lg p-1 px-2 text-yellow-200">
                                        ROOM ID: {game?.roomID}
                                    </div>
                                    <div className="flex justify-evenly py-2 text-base">
                                        <div className="basis-[48%]">
                                            <div className="flex flex-col p-2 bg-slate-800 justify-between rounded-xl my-0 shadow-md text-slate-50 ">
                                                <p className="flex justify-evenly text-blue-300">
                                                    <span>Players: </span>
                                                    <span>
                                                        {game?.users[0]?.name}{" "}
                                                        vs.{" "}
                                                        {game?.users[1]?.name}
                                                    </span>
                                                </p>
                                                <p className="flex justify-evenly mb-2">
                                                    <span>
                                                        Current Scores:{" "}
                                                    </span>
                                                    {game?.scores[0]} :{" "}
                                                    {game?.scores[1]}
                                                </p>
                                                <button
                                                    className="rounded-full bg-slate-600 p-1 transition
													hover:bg-rose-700 duration-300 w-full"
                                                    onClick={() => {
                                                        console.log("click");
                                                        resetHandler(game);
                                                    }}
                                                >
                                                    RESET GAME
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col basis-[48%] bg-slate-800 rounded-xl">
                                            <div className="m-auto">
                                                <div className="text-lime-300 text-lg">
                                                    Grid size:{" "}
                                                    {Math.sqrt(game.gridSize)} X{" "}
                                                    {Math.sqrt(game.gridSize)}
                                                </div>
                                                <div className="grid gap-x-2 grid-cols-2">
                                                    {Object.keys(
                                                        game.minesConfig
                                                    ).map(
                                                        (
                                                            key: string,
                                                            index: number
                                                        ) => {
                                                            return (
                                                                <div className="flex">
                                                                    <Image
                                                                        type={
                                                                            Object.keys(
                                                                                game.minesConfig
                                                                            )[
                                                                                index
                                                                            ]
                                                                        }
                                                                        className="w-6 h-6 mx-2"
                                                                    />
                                                                    {key}:{" "}
                                                                    {
                                                                        game
                                                                            .minesConfig[
                                                                            key
                                                                        ].amount
                                                                    }
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </span>
                        ))}
                    </div>
                </Card>
            </div>
            <SocketID />
        </div>
    );
};
export default Admin;

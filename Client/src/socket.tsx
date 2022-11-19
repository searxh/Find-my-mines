import React, { createContext } from "react";
import { useLocation } from "react-router-dom";
import { Socket } from "socket.io-client";
import { GlobalContext } from "./states";
import {
    GameInfoType,
    UserType,
    SocketContextType,
    FlagsType,
    PersistentFlagsType,
} from "./types";
import { io } from "socket.io-client";
import isEqual from "lodash/isEqual";
import { ioString } from "./lib/defaults/Default";
import { NavigateContext } from "./lib/utility/Navigate";

export const SocketContext = createContext<SocketContextType>(
    {} as SocketContextType
);

const events = [
    "connect",
    "active user update",
    "start game",
    "gameInfo update",
    "add active game update",
    "remove active game update",
    "active game update",
    "reset game",
    "counter",
    "pause/unpause update",
    "end game",
    "other user left",
];

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const { global_state, dispatch } = React.useContext(GlobalContext);
    const { navigate } = React.useContext(NavigateContext);
    const { gameInfo, name, flags, persistentFlags } = global_state;
    const [socket, setSocket] = React.useState<Socket | undefined>(undefined);
    const [reconnectInGame, setReconnectInGame] =
        React.useState<boolean>(false);
    const location = useLocation();
    React.useEffect(() => {
        if (socket !== undefined) {
            socket.on("connect", () => {
                dispatch({
                    type: "set",
                    field: "socketID",
                    payload: socket.id,
                });
                if (persistentFlags.canAutoNameRegister) {
                    socket.emit("name register", {
                        name: name,
                        id: socket.id,
                        inGame: false,
                    });
                }
            });
            socket.on("active user update", (activeUsersFromServer: any) => {
                const users: Array<UserType> = Object.values(
                    activeUsersFromServer
                );
                if (!flags.activeUsersInitialized) {
                    const newFlags: FlagsType = {
                        ...flags,
                        activeUsersInitialized: true,
                    };
                    dispatch({
                        type: "multi-set",
                        field: ["activeUsers", "flags"],
                        payload: [users, newFlags],
                    });
                } else {
                    dispatch({
                        type: "set",
                        field: "activeUsers",
                        payload: users,
                    });
                }
                /*setTimeout(() => {
                    if (!isEqual(activeUsers, users)) {
                        console.log("[RE-DISPATCH] ACTIVE USERS");
                        dispatch({
                            type: "multi-set",
                            field: ["activeUsers", "flags"],
                            payload: [
                                users,
                                {
                                    ...flags,
                                    resultVisible: true,
                                    userLeft: true,
                                },
                            ],
                        });
                    }
                }, 1000);*/
            });
            socket.on("start game", (gameInfo: GameInfoType) => {
                console.log("starting game");
                const newFlags: FlagsType = {
                    ...flags,
                    isMatching: false,
                };
                const newPersistentFlags: PersistentFlagsType = {
                    ...persistentFlags,
                    howToPlayIsActive: false,
                    resultVisible: false,
                    userLeft: false,
                    isPaused: false,
                };
                dispatch({
                    type: "multi-set",
                    field: [
                        "gameInfo",
                        "flags",
                        "persistentFlags",
                        "pendingInvite",
                    ],
                    payload: [gameInfo, newFlags, newPersistentFlags, {}],
                });
                setTimeout(() => navigate("game"), 1000);
            });
            socket.on("gameInfo update", (gameInfo: GameInfoType) => {
                console.log("let's gameInfo update lol");
                dispatch({
                    type: "set",
                    field: "gameInfo",
                    payload: gameInfo,
                });
            });
            socket.on("add active game update", (activeGames: any) => {
                dispatch({
                    type: "set",
                    field: "activeGames",
                    payload: activeGames,
                });
            });
            socket.on("remove active game update", (info: any) => {
                dispatch({
                    type: "remove game",

                    payload: { gameInfo: info },
                });
            });
            socket.on("active game update", (info: any) => {
                dispatch({
                    type: "update game",

                    payload: { gameInfo: info },
                });
            });
            socket.on("reset game", (info: any) => {
                dispatch({
                    type: "reset game",

                    payload: { gameInfo: info },
                });
            });
            socket.on("counter", (timer: number) => {
                dispatch({
                    type: "timer",
                    payload: timer,
                });
            });
            socket.on(
                "pause/unpause update",
                ({ pause }: { pause: boolean }) => {
                    const newPersistentFlags: PersistentFlagsType = {
                        ...persistentFlags,
                        isPaused: pause,
                    };
                    dispatch({
                        type: "set",
                        field: "persistentFlags",
                        payload: newPersistentFlags,
                    });
                }
            );
            socket.on("end game", (gameInfo: GameInfoType) => {
                dispatch({
                    type: "set",
                    field: "gameInfo",
                    payload: gameInfo,
                });
                //delay showing results (to allow users to see last mine first)
                setTimeout(() => {
                    const newPersistentFlags: PersistentFlagsType = {
                        ...persistentFlags,
                        resultVisible: true,
                    };
                    dispatch({
                        type: "set",
                        field: "persistentFlags",
                        payload: newPersistentFlags,
                    });
                }, 2000);
            });
            socket.on("other user left", () => {
                console.log("OTHER USER LEFT");
                const newPersistentFlags: PersistentFlagsType = {
                    ...persistentFlags,
                    resultVisible: true,
                    userLeft: true,
                };
                dispatch({
                    type: "set",
                    field: "persistentFlags",
                    payload: newPersistentFlags,
                });
                //in the case where dispatch fails
                /*setTimeout(() => {
                    if (
                        persistentFlags.resultVisible !== true &&
                        persistentFlags.userLeft !== true
                    ) {
                        console.log("[RE-DISPATCH] OTHER USER LEFT");
                        dispatch({
                            type: "set",
                            field: "persistentFlags",
                            payload: {
                                ...persistentFlags,
                                resultVisible: true,
                                userLeft: true,
                            },
                        });
                    }
                }, 1000);*/
            });
        } else {
            setTimeout(() => {
                if (
                    location.pathname.includes("game") &&
                    socket === undefined &&
                    !persistentFlags.userLeft
                ) {
                    setSocket(io(ioString));
                    setReconnectInGame(true);
                } else if (
                    location.pathname.includes("menu") &&
                    socket === undefined
                ) {
                    console.log("setting socket");
                    setSocket(io(ioString));
                } else if (
                    location.pathname.includes("admin") &&
                    socket === undefined
                ) {
                    setSocket(io(ioString));
                }
            }, 300);
        }
        return () => events.forEach((event) => socket?.off(event));
    }, [socket, location.pathname]);
    React.useEffect(() => {
        if (
            reconnectInGame &&
            socket !== undefined &&
            flags.activeUsersInitialized &&
            gameInfo.roomID !== undefined
        ) {
            console.log("attempting to reconnect game");
            socket.emit("reconnect game", { roomID: gameInfo.roomID });
            setReconnectInGame(false);
        }
    }, [reconnectInGame, flags.activeUsersInitialized]);
    return (
        <SocketContext.Provider
            value={
                { socket: socket, setSocket: setSocket } as SocketContextType
            }
        >
            {children}
        </SocketContext.Provider>
    );
};

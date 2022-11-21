"use strict";
const uuid = require("uuid");
const app = require("express")();

const http = require("http").Server(app);
const socketIO = require("socket.io")(http, {
    cors: {
        origin: "*",
    },
});
const Please = require("pleasejs");
const addSeconds = require("date-fns/addSeconds");
const compareAsc = require("date-fns/compareAsc");

const defaultMinesConfig: MinesConfigType = {
    Legendary: {
        points: 700,
        amount: 1,
    },
    Epic: {
        points: 500,
        amount: 2,
    },
    Rare: {
        points: 300,
        amount: 3,
    },
    Common: {
        points: 200,
        amount: 5,
    },
};

let chatHistory: ChatHistoryType = {
    global: [],
    local: {},
};
let activeUsers: { [key: string]: UserType } = {};
let activeGames: Array<GameInfoType> = [];
let invitation: { [key: string]: InvitationType } = {};
let counters: Array<CounterType> = [];
let gameInfos: Array<GameInfoType> = [];

const getRandomInt = (min: number, max: number) => {
    return Math.round(Math.random() * (max - min) + min);
};
const getUserColor = () => {
    return Please.make_color({
        saturation: 0.4,
        value: 0.7,
        format: "rgb-string",
    });
};
const chooseRandomUser = () => {
    return Math.random() > 0.5 ? 1 : 0;
};
const generateID = (): string => {
    return uuid.v4();
};
const getTotalMines = (minesConfig: MinesConfigType) => {
    return Object.values(minesConfig).reduce(
        (sum, mine) => sum + mine.amount,
        0
    );
};
const createMinesArray = ({
    gridSize,
    minesConfig,
}: {
    gridSize: number;
    minesConfig: MinesConfigType;
}) => {
    let nums = new Set<number>();
    const totalMines = getTotalMines(minesConfig);
    while (nums.size < totalMines) {
        nums.add(Math.floor(Math.random() * gridSize));
    }
    const types = generateTypesIndexesFrom(getMinesAmountArray(minesConfig), [
        ...nums,
    ]);
    const bombIndexes: Array<number> = [];
    nums.forEach((num: number) => bombIndexes.push(num));
    const arr: Array<BlockType> = [...Array(gridSize)].map(
        (value: number, index: number) => {
            return bombIndexes.includes(index)
                ? {
                      selected: false,
                      value: 1,
                      selectedBy: "",
                      type: types[index],
                  }
                : {
                      selected: false,
                      value: 0,
                      selectedBy: "",
                      type: null,
                  };
        }
    );
    return arr;
};
const generateTypesIndexesFrom = (
    amountArray: Array<number>,
    arr: Array<number>
) => {
    const types: { [key: string]: string | null } = {};
    amountArray.forEach((value: number, index: number) => {
        for (let i = 0; i < value; i++) {
            const selectedNum = getRandomInt(0, arr.length - 1);
            types[arr[selectedNum]] =
                index === 0
                    ? "Legendary"
                    : index === 1
                    ? "Epic"
                    : index === 2
                    ? "Rare"
                    : index === 3
                    ? "Common"
                    : null;
            arr = arr.filter((num: number) => num !== arr[selectedNum]);
        }
    });
    return types;
};
const generateGameInfo = (
    type: string,
    gameOptions?: {
        gridSize: number;
        minesConfig: MinesConfigType;
    }
) => {
    const id = generateID();
    const config = gameOptions
        ? gameOptions.minesConfig
        : { ...defaultMinesConfig };
    const size = gameOptions ? gameOptions.gridSize : 36;
    const newGameInfo: GameInfoType = {
        roomID: id,
        type: type,
        timer: 10,
        state: 1,
        gridSize: size,
        minesConfig: config,
        winningScore: getWinningScore(config),
        users: [] as Array<UserType>,
        playingUser: chooseRandomUser(),
        scores: [0, 0],
        minesArray: createMinesArray({ gridSize: size, minesConfig: config }),
    };
    gameInfos.push(newGameInfo);
    counters.push({
        roomID: id,
        countdown: false,
    });
    chatHistory.local[id] = [];
    console.log("GENERATED CHAT INFO", chatHistory.local);
    return newGameInfo;
};
const resetRoom = (roomID: string) => {
    const info = getGameInfo(roomID);
    if (info !== undefined) {
        info.timer = 10;
        info.playingUser = info.scores[0] > info.scores[1] ? 0 : 1;
        info.scores = [0, 0];
        info.minesArray = createMinesArray({
            gridSize: info.gridSize,
            minesConfig: info.minesConfig,
        });
    }
    return info;
};
const removeRoom = (roomID: string) => {
    gameInfos = gameInfos.filter(
        (gameInfo: GameInfoType) => gameInfo.roomID !== roomID
    );
    delete chatHistory.local[roomID];
    console.log("REMOVED ROOM", roomID);
};
const resetCountdown = (info: GameInfoType, roomID: string) => {
    const counter = getCounter(roomID);
    if (counter !== undefined) {
        counter.countdown = setInterval(() => {
            socketIO.to(roomID).emit("counter", info.timer);
            info.timer--;
            if (info.timer === -1) {
                switchUser(roomID);
                info.timer = 10;
                socketIO.to(roomID).emit("gameInfo update", info);
            }
        }, 1000);
    }
};
const getGameInfo = (roomID: string) => {
    return gameInfos.find(
        (info: GameInfoType) => info.roomID === roomID
    ) as GameInfoType;
};
const getCounter = (roomID: string) => {
    return counters.find(
        (counterObj: CounterType) => counterObj.roomID === roomID
    ) as CounterType;
};
const getWinningScore = (minesConfig: MinesConfigType) => {
    return Object.values(minesConfig).reduce(
        (sum, mine) => sum + mine.points * mine.amount,
        0
    );
};
const getMinesAmountArray = (minesConfig: MinesConfigType) => {
    return Object.values(minesConfig).map((mine) => mine.amount);
};
const removeUser = (user: UserType, callback: Function) => {
    let info = gameInfos.find((infoObj: GameInfoType) => {
        if (
            infoObj.scores[0] + infoObj.scores[1] !== infoObj.winningScore &&
            infoObj.type === "matching"
        ) {
            return (
                infoObj.users.find(
                    (userObj: UserType) => userObj.name === user.name
                ) !== undefined
            );
        } else {
            return false;
        }
    });
    if (info === undefined) {
        console.log("undefined info");
    } else {
        info.users = info.users.filter(
            (userObj: UserType) => user.name !== userObj.name
        );
        callback(info.roomID);
    }
};
const cleanGameInfos = () => {
    gameInfos = gameInfos.filter((gameInfo: GameInfoType) => {
        if (
            gameInfo.scores[0] + gameInfo.scores[1] === gameInfo.winningScore ||
            gameInfo.state === 0
        ) {
            delete chatHistory.local[gameInfo.roomID];
            return false;
        } else {
            return true;
        }
    });
    console.log("cleared unused rooms", gameInfos);
};
const switchUser = (roomID: string) => {
    const info = getGameInfo(roomID);
    const newPlayingUser = Number(!Boolean(info.playingUser));
    info.playingUser = newPlayingUser;
};
const checkEndGame = (roomID: string) => {
    const info = getGameInfo(roomID);
    return info.scores[0] + info.scores[1] === info.winningScore;
};
const addInvitation = (key: string, value: InvitationType) => {
    invitation[key] = value;
};
const removeExpiredInvitation = () => {
    const expiredKeys = Object.keys(invitation).filter((key: string) =>
        compareAsc(Date.now(), invitation[key].validUntil) === 1 ? true : false
    );
    console.log("EXPIRED_KEYS", expiredKeys);
    expiredKeys.forEach(async (key: string) => {
        const roomID = invitation[key].roomID;
        //removes the room that is created as well if room doesn't have 2 people
        //and the game haven't started
        const info = getGameInfo(roomID);
        const sockets = await socketIO.in(roomID).fetchSockets();
        if (sockets.length < 2 && info.state < 2) removeRoom(roomID);
        delete invitation[key];
    });
    console.log("FILTERED EXPIRED", invitation);
};
const expireInvitation = (senderName: string) => {
    const expiredKeys = Object.keys(invitation).filter(
        (key: string) => invitation[key].senderName === senderName
    );
    if (expiredKeys !== undefined) {
        expiredKeys.forEach(async (key: string) => {
            const roomID = invitation[key].roomID;
            //removes the room that is created as well if room doesn't have 2 people
            //and the game haven't started
            const info = getGameInfo(roomID);
            const sockets = await socketIO.in(roomID).fetchSockets();
            if (sockets.length < 2 && info.state < 2) removeRoom(roomID);
            delete invitation[key];
        });
    }
    console.log("FILTERED EXPIRE MANUAL", invitation);
};
const getMostRecentInvitation = (senderName: string, receiverName: string) => {
    const mostRecentInvitation = Object.keys(invitation)
        .sort((a: string, b: string) => {
            return compareAsc(
                invitation[b].validUntil,
                invitation[a].validUntil
            );
        })
        .find(
            (key: string) =>
                invitation[key].senderName === senderName &&
                invitation[key].receiverName === receiverName
        );
    if (mostRecentInvitation !== undefined) {
        console.log("MOST RECENT INVITATION", mostRecentInvitation);
        return invitation[mostRecentInvitation];
    } else {
        return;
    }
};

app.get("/", function (res: any) {
    res.sendFile(__dirname + "/index.html");
});

http.listen(7070, "0.0.0.0", () => {
    console.log("listening on *:7070");
});

socketIO.of("/").adapter.on("join-room", async (roomID: string, id: string) => {
    console.log(`${id} has joined room ${roomID}`);
    if (roomID.length > 20) {
        const info = getGameInfo(roomID);
        const sockets = await socketIO.in(info.roomID).fetchSockets();
        if (sockets.length === 2 && info.state !== 2) {
            console.log("starting game for room ", info.roomID);
            info.users.forEach((user) => {
                activeUsers[user.name].inGame = true;
            });
            console.log("ACTIVE USERS BEFORE START GAME", activeUsers);
            socketIO.emit("active user update", activeUsers);
            socketIO.to(info.roomID).emit("start game", info);
            activeGames.push(info);
            socketIO.emit("add active game update", activeGames);
            const counter = getCounter(info.roomID);
            if (!counter.countdown) {
                console.log("set countdown");
                info.state = 2;
                counter.countdown = setInterval(() => {
                    socketIO.to(info.roomID).emit("counter", info.timer);
                    info.timer--;
                    if (info.timer === -1) {
                        switchUser(info.roomID);
                        info.timer = 10;
                        socketIO.to(info.roomID).emit("gameInfo update", info);
                    }
                }, 1000);
            }
        }
    }
});

socketIO.of("/").adapter.on("leave-room", (roomID: string, id: string) => {
    console.log(`${id} has left room ${roomID}`);
    //only for leave events that are game room ids and game has started before
    const info = getGameInfo(roomID);
    if (roomID.length > 20 && info?.state === 2) {
        //saves the name of the user according to id
        //(since id will change after reconnect)
        const saveUser = Object.keys(activeUsers).find((value: string) => {
            return activeUsers[value].id === id;
        });
        //delay for 1.75 seconds to allow user to reconnect
        setTimeout(async () => {
            //checks if the user has reconnected,
            //if not notify other user that they have left
            const sockets = await socketIO.in(roomID).fetchSockets();
            const findRes = sockets.find((socket: any) => {
                return socket.data.name === saveUser;
            });
            if (findRes === undefined) {
                socketIO.to(roomID).emit("other user left");
            }
            //check how many users are left in the room, if none left then close the room
            console.log("ROOM SIZE", sockets.length);
            if (sockets.length === 0) {
                info.state = 0;
                const counter = getCounter(roomID);
                clearInterval(
                    counter.countdown as ReturnType<typeof setInterval>
                );
                console.log("CLEAN GAME INFO", roomID);
                socketIO.emit("remove active game update", info);
                activeGames = activeGames.filter(
                    (activeGame: GameInfoType) =>
                        activeGame.roomID !== info.roomID
                );
                cleanGameInfos();
            }
        }, 1750);
    }
});

socketIO.on("connection", (socket: any) => {
    console.log("Connected!", socket.id, socketIO.of("/").sockets.size);
    socket.on("name probe", (userName: string) => {
        const nameExists = activeUsers[userName] !== undefined;
        socketIO.to(socket.id).emit("name probe response", nameExists);
    });
    socket.on("name register", (user: UserType) => {
        socket.data.name = user.name;
        activeUsers[user.name] = {
            id: user.id,
            name: user.name,
            inGame: user.inGame,
            color: getUserColor(),
        };
        console.log("Active users", activeUsers);
        socketIO.emit("active user update", activeUsers);
        socketIO.emit("add active game update", activeGames);
    });
    socket.on("matching", async (user: UserType) => {
        console.log("Matching request", user);
        while (true) {
            for (let i = 0; i < gameInfos.length; i++) {
                const info = gameInfos[i];
                const sockets = await socketIO.in(info.roomID).fetchSockets();
                if (
                    info.scores[0] + info.scores[1] !== info.winningScore &&
                    sockets.length < 2 &&
                    info.users.length < 2 &&
                    info.type === "matching"
                ) {
                    info.users.push(user);
                    socket.join(info.roomID);
                    gameInfos.forEach((gameInfo) => {
                        console.log(
                            gameInfo?.roomID,
                            gameInfo?.users[0],
                            gameInfo?.users[1]
                        );
                    });
                    return;
                }
            }
            console.log("full rooms, creating new room...");
            generateGameInfo("matching");
        }
    });
    socket.on("unmatching", (user: UserType) => {
        console.log("Unmatching request", user);
        removeUser(user, (roomID: string) => socket.leave(roomID));
    });
    socket.on(
        "invite request",
        ({
            senderName,
            receiverName,
            inviteMessage,
            gameOptions,
        }: {
            senderName: string;
            receiverName: string;
            inviteMessage: string;
            gameOptions: GameOptionsType;
        }) => {
            const info = generateGameInfo("invitation", gameOptions);
            addInvitation(info.roomID, {
                roomID: info.roomID,
                senderName: senderName,
                receiverName: receiverName,
                validUntil: addSeconds(Date.now(), 15),
            });
            console.log("INVITATION", invitation);

            //removes user if they are in a room
            //(this can happen if player is matching and acccepted an invitation)
            console.log("ACTIVE USERS", activeUsers);
            removeUser(activeUsers[senderName], (roomID: string) =>
                socket.leave(roomID)
            );
            info.users.push(activeUsers[senderName]);
            socket.join(info.roomID);
            socketIO.to(activeUsers[receiverName].id).emit("request incoming", {
                senderName: senderName,
                roomID: info.roomID,
                inviteMessage: inviteMessage,
            });
        }
    );
    socket.on(
        "invite reply",
        ({
            senderName,
            receiverName,
            decision,
        }: {
            senderName: string;
            receiverName: string;
            decision: boolean;
        }) => {
            //remove any expired invitation (by timeout)
            console.log("ACTIVE USERS", activeUsers);
            removeExpiredInvitation();
            //gets the most recent invitation of sender and receiver
            //(prevents multiple invitations of same pair of sender and receiver)
            const inviteInfo = getMostRecentInvitation(
                senderName,
                receiverName
            );
            const roomID =
                inviteInfo !== undefined ? inviteInfo.roomID : undefined;
            socketIO.to(activeUsers[senderName].id).emit("reply incoming", {
                receiverName: receiverName,
                decision: decision,
            });
            //no invitation was found (expired)
            if (roomID === undefined) {
                socketIO
                    .to(activeUsers[receiverName].id)
                    .emit("request incoming", { error: true }),
                    //tear down room because invitation was expired
                    socketIO.socketsLeave(roomID);
                //manually expire all invitation of one sender (since invitation was successful)
                expireInvitation(senderName);
                //invitation was found
            } else {
                //invitation was accepted
                if (decision) {
                    console.log(
                        "request from",
                        senderName,
                        "accepted by",
                        receiverName,
                        socket.id
                    );
                    const info = getGameInfo(roomID);
                    //removes user if they are in a room
                    //(this can happen if player is matching and acccepted an invitation)
                    removeUser(activeUsers[receiverName], (roomID: string) =>
                        socket.leave(roomID)
                    );
                    info.users.push(activeUsers[receiverName]);
                    socket.join(roomID);
                    expireInvitation(senderName);
                    //invitation was declined
                } else {
                    console.log(
                        "request from",
                        senderName,
                        "declined by",
                        receiverName,
                        socket.id
                    );
                }
            }
        }
    );
    socket.on("active user request", () => {
        socketIO.to(socket.id).emit("active user update", activeUsers);
        console.log(Object.keys(activeUsers).length + " users are registered");
    });
    socket.on(
        "chat request",
        ({ name, roomID }: { name: string; roomID: string | undefined }) => {
            //server selects and sends the chat history according to user status (online or in-game)
            //chat histories are private (different roomID will not have access to each other's chat history)
            //console.log("CHAT REQUEST ARG", name, roomID, activeUsers)
            if (activeUsers[name]?.inGame && roomID !== undefined) {
                socketIO
                    .to(roomID)
                    .emit("chat update", { local: chatHistory.local[roomID] });
            } else {
                const filteredGameInfos = gameInfos.filter(
                    (gameInfo: GameInfoType) => gameInfo.state === 2
                );
                socketIO
                    .except(
                        filteredGameInfos.map(
                            (gameInfo: GameInfoType) => gameInfo.roomID
                        )
                    )
                    .emit("chat update", { global: chatHistory.global });
            }
        }
    );
    socket.on(
        "chat message",
        ({
            msg,
            name,
            roomID,
        }: {
            msg: MessageType;
            name: string;
            roomID: string | undefined;
        }) => {
            //server selects and sends the chat history according to user status (online or in-game)
            //chat histories are private (different roomID will not have access to each other's chat history)
            if (activeUsers[name]?.inGame && roomID !== undefined) {
                chatHistory.local[roomID].push(msg);
                socketIO
                    .to(roomID)
                    .emit("chat update", { local: chatHistory.local[roomID] });
            } else {
                chatHistory.global.push(msg);
                const filteredGameInfos = gameInfos.filter(
                    (gameInfo: GameInfoType) => gameInfo.state === 2
                );
                socketIO
                    .except(
                        filteredGameInfos.map(
                            (gameInfo: GameInfoType) => gameInfo.roomID
                        )
                    )
                    .emit("chat update", { global: chatHistory.global });
            }
        }
    );
    socket.on("admin clear chat", () => {
        chatHistory.global = [];
        socketIO
            .except(gameInfos.map((gameInfo: GameInfoType) => gameInfo.roomID))
            .emit("chat update", chatHistory.global);
    });
    socket.on("admin reset game", (gameInfo: GameInfoType) => {
        socketIO
            .to(gameInfo.roomID)
            .emit("gameInfo update", resetRoom(gameInfo.roomID));
        socketIO.emit("active game update", resetRoom(gameInfo.roomID));
    });
    socket.on(
        "select block",
        ({
            index,
            roomID,
            name,
        }: {
            index: number;
            roomID: string;
            name: string;
        }) => {
            const info = getGameInfo(roomID);
            info.minesArray[index].selected = true;
            info.minesArray[index].selectedBy = name;
            if (info.minesArray[index].value === 1) {
                info.scores[info.playingUser] +=
                    info.minesConfig[
                        info.minesArray[index].type as string
                    ].points;
                socketIO.emit("active game update", info);
            }
            if (checkEndGame(roomID)) {
                socketIO.to(roomID).emit("end game", info);
                const counter = getCounter(roomID);
                clearInterval(
                    counter.countdown as ReturnType<typeof setInterval>
                );
                counter.countdown = false;
                info.timer = 10;
            } else {
                switchUser(roomID);
                info.timer = 10;
                socketIO.to(roomID).emit("gameInfo update", info);
            }
        }
    );
    socket.on(
        "pause/unpause",
        ({ roomID, requester }: { roomID: string; requester?: string }) => {
            const counter = getCounter(roomID);
            const info = getGameInfo(roomID);
            console.log("COUNTER", counter);
            if (!counter.countdown) {
                //unpause
                console.log("[UNPAUSE]", roomID, requester);
                counter.countdown = setInterval(() => {
                    socketIO.to(info.roomID).emit("counter", info.timer);
                    info.timer--;
                    if (info.timer === -1) {
                        switchUser(info.roomID);
                        info.timer = 10;
                        socketIO.to(info.roomID).emit("gameInfo update", info);
                    }
                }, 1000);
                socketIO
                    .to(info.roomID)
                    .emit("pause/unpause update", { pause: false });
            } else {
                //pause
                console.log("[PAUSE]", roomID, requester);
                clearInterval(
                    counter.countdown as ReturnType<typeof setInterval>
                );
                counter.countdown = false;
                socketIO
                    .to(info.roomID)
                    .emit("pause/unpause update", { pause: true });
            }
        }
    );
    socket.on("leave room request", (roomID: string) => {
        const updatedUser = Object.keys(activeUsers).find(
            (key) => activeUsers[key].id === socket.id
        );
        if (updatedUser !== undefined) {
            activeUsers[updatedUser].inGame = false;
            socketIO.emit("active user update", activeUsers);
        }
        socket.leave(roomID);
        const counter = getCounter(roomID);
        if (counter)
            clearInterval(counter.countdown as ReturnType<typeof setInterval>);
    });
    socket.on("reconnect game", ({ roomID }: { roomID: string }) => {
        if (activeUsers[socket.data.name] !== undefined) {
            socket.join(roomID);
        } else {
            console.log(
                "active users not found",
                activeUsers[socket.data.name],
                socket.data.name
            );
        }
    });
    socket.on(
        "play again",
        ({
            gameInfo,
            requester,
        }: {
            gameInfo: GameInfoType;
            requester: UserType;
        }) => {
            console.log("play again", gameInfo.roomID);
            socketIO.to(gameInfo.roomID).emit("rematch request", requester);
        }
    );
    socket.on("rematch accepted", (roomID: string) => {
        const info = resetRoom(roomID);
        socketIO.to(roomID).emit("start game", info);
        resetCountdown(info, roomID);
    });
    socket.on("confetti", ({ targetPlayer }: { targetPlayer: string }) => {
        if (activeUsers[targetPlayer] !== undefined) {
            console.log(
                "[CONFETTI] sent from",
                socket.data.name,
                "to",
                targetPlayer
            );
            socket
                .to(activeUsers[targetPlayer].id)
                .emit("confetti from sender");
        }
    });
    socket.on("disconnect", () => {
        console.log(
            socket.data.name + " has disconnected",
            socketIO.of("/").sockets.size
        );
        delete activeUsers[socket.data.name];
        //prevents failing name probing users (no name user) from spamming active user update
        if (socket.data.name !== undefined)
            socketIO.emit("active user update", activeUsers);
    });
});
interface MinesConfigType {
    [key: string]: {
        points: number;
        amount: number;
    };
}
interface GameOptionsType {
    gridSize: number;
    minesConfig: MinesConfigType;
}
interface MessageType {
    from: string;
    message: string;
    at: string | number;
}
interface BlockType {
    selected: boolean;
    value: number;
    selectedBy: string;
    type: string | null;
}
interface UserType {
    name: string;
    id: string;
    inGame: boolean;
    color: string;
}
interface InvitationType {
    roomID: string;
    senderName: string;
    receiverName: string;
    validUntil: Date;
}
interface GameInfoType {
    roomID: string;
    timer: number;
    type: string;
    state: number;
    users: Array<UserType>;
    gridSize: number;
    winningScore: number;
    minesConfig: MinesConfigType;
    playingUser: number;
    scores: Array<number>;
    minesArray: Array<BlockType>;
}
interface CounterType {
    roomID: string;
    countdown: ReturnType<typeof setInterval> | boolean;
}
interface ChatRoomHistoryKeys {
    [key: string]: any;
}
interface ChatRoomHistoryType extends ChatRoomHistoryKeys {
    [key: string]: Array<MessageType>;
}
interface ChatHistoryType {
    global: Array<MessageType>;
    local: {
        [key: string]: Array<MessageType>;
    };
}

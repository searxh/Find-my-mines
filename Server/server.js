"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const defaultMinesConfig = {
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
let chatHistory = {
    global: [],
    local: {},
};
let activeUsers = {};
let activeGames = [];
let invitation = {};
let counters = [];
let gameInfos = [];
const getRandomInt = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
};
const getUserColor = () => {
    return Please.make_color();
};
const chooseRandomUser = () => {
    return Math.random() > 0.5 ? 1 : 0;
};
const generateID = () => {
    return uuid.v4();
};
const getTotalMines = (minesConfig) => {
    return Object.values(minesConfig).reduce((sum, mine) => sum + mine.amount, 0);
};
const createMinesArray = ({ gridSize, minesConfig, }) => {
    let nums = new Set();
    const totalMines = getTotalMines(minesConfig);
    while (nums.size < totalMines) {
        nums.add(Math.floor(Math.random() * gridSize));
    }
    const types = generateTypesIndexesFrom(getMinesAmountArray(minesConfig), [
        ...nums,
    ]);
    const bombIndexes = [];
    nums.forEach((num) => bombIndexes.push(num));
    const arr = [...Array(gridSize)].map((value, index) => {
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
    });
    return arr;
};
const generateTypesIndexesFrom = (amountArray, arr) => {
    const types = {};
    amountArray.forEach((value, index) => {
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
            arr = arr.filter((num) => num !== arr[selectedNum]);
        }
    });
    return types;
};
const generateGameInfo = (type, gameOptions) => {
    const id = generateID();
    const config = gameOptions
        ? gameOptions.minesConfig
        : Object.assign({}, defaultMinesConfig);
    const size = gameOptions ? gameOptions.gridSize : 36;
    const newGameInfo = {
        roomID: id,
        type: type,
        timer: 10,
        state: 1,
        gridSize: size,
        minesConfig: config,
        winningScore: getWinningScore(config),
        users: [],
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
const resetRoom = (roomID) => {
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
const removeRoom = (roomID) => {
    gameInfos = gameInfos.filter((gameInfo) => gameInfo.roomID !== roomID);
    delete chatHistory.local[roomID];
    console.log("REMOVED ROOM", roomID);
};
const resetCountdown = (info, roomID) => {
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
const getGameInfo = (roomID) => {
    return gameInfos.find((info) => info.roomID === roomID);
};
const getCounter = (roomID) => {
    return counters.find((counterObj) => counterObj.roomID === roomID);
};
const getWinningScore = (minesConfig) => {
    return Object.values(minesConfig).reduce((sum, mine) => sum + mine.points * mine.amount, 0);
};
const getMinesAmountArray = (minesConfig) => {
    return Object.values(minesConfig).map((mine) => mine.amount);
};
const removeUser = (user, callback) => {
    let info = gameInfos.find((infoObj) => {
        if (infoObj.scores[0] + infoObj.scores[1] !== infoObj.winningScore &&
            infoObj.type === "matching") {
            return (infoObj.users.find((userObj) => userObj.name === user.name) !== undefined);
        }
        else {
            return false;
        }
    });
    if (info === undefined) {
        console.log("undefined info");
    }
    else {
        info.users = info.users.filter((userObj) => user.name !== userObj.name);
        callback(info.roomID);
    }
};
const cleanGameInfos = () => {
    gameInfos = gameInfos.filter((gameInfo) => {
        if (gameInfo.scores[0] + gameInfo.scores[1] === gameInfo.winningScore ||
            gameInfo.state === 0) {
            delete chatHistory.local[gameInfo.roomID];
            return false;
        }
        else {
            return true;
        }
    });
    console.log("cleared unused rooms", gameInfos);
};
const switchUser = (roomID) => {
    const info = getGameInfo(roomID);
    const newPlayingUser = Number(!Boolean(info.playingUser));
    info.playingUser = newPlayingUser;
};
const checkEndGame = (roomID) => {
    const info = getGameInfo(roomID);
    return info.scores[0] + info.scores[1] === info.winningScore;
};
const addInvitation = (key, value) => {
    invitation[key] = value;
};
const removeExpiredInvitation = () => {
    const expiredKeys = Object.keys(invitation).filter((key) => compareAsc(Date.now(), invitation[key].validUntil) === 1 ? true : false);
    console.log("EXPIRED_KEYS", expiredKeys);
    expiredKeys.forEach((key) => __awaiter(void 0, void 0, void 0, function* () {
        const roomID = invitation[key].roomID;
        //removes the room that is created as well if room doesn't have 2 people
        //and the game haven't started
        const info = getGameInfo(roomID);
        const sockets = yield socketIO.in(roomID).fetchSockets();
        if (sockets.length < 2 && info.state < 2)
            removeRoom(roomID);
        delete invitation[key];
    }));
    console.log("FILTERED EXPIRED", invitation);
};
const expireInvitation = (senderName) => {
    const expiredKeys = Object.keys(invitation).filter((key) => invitation[key].senderName === senderName);
    if (expiredKeys !== undefined) {
        expiredKeys.forEach((key) => __awaiter(void 0, void 0, void 0, function* () {
            const roomID = invitation[key].roomID;
            //removes the room that is created as well if room doesn't have 2 people
            //and the game haven't started
            const info = getGameInfo(roomID);
            const sockets = yield socketIO.in(roomID).fetchSockets();
            if (sockets.length < 2 && info.state < 2)
                removeRoom(roomID);
            delete invitation[key];
        }));
    }
    console.log("FILTERED EXPIRE MANUAL", invitation);
};
const getMostRecentInvitation = (senderName, receiverName) => {
    const mostRecentInvitation = Object.keys(invitation)
        .sort((a, b) => {
        return compareAsc(invitation[b].validUntil, invitation[a].validUntil);
    })
        .find((key) => invitation[key].senderName === senderName &&
        invitation[key].receiverName === receiverName);
    if (mostRecentInvitation !== undefined) {
        console.log("MOST RECENT INVITATION", mostRecentInvitation);
        return invitation[mostRecentInvitation];
    }
    else {
        return;
    }
};
app.get("/", function (res) {
    res.sendFile(__dirname + "/index.html");
});
http.listen(7070, "0.0.0.0", () => {
    console.log("listening on *:7070");
});
socketIO.of("/").adapter.on("join-room", (roomID, id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`${id} has joined room ${roomID}`);
    if (roomID.length > 20) {
        const info = getGameInfo(roomID);
        const sockets = yield socketIO.in(info.roomID).fetchSockets();
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
}));
socketIO.of("/").adapter.on("leave-room", (roomID, id) => {
    console.log(`${id} has left room ${roomID}`);
    //only for leave events that are game room ids and game has started before
    const info = getGameInfo(roomID);
    if (roomID.length > 20 && (info === null || info === void 0 ? void 0 : info.state) === 2) {
        //saves the name of the user according to id
        //(since id will change after reconnect)
        const saveUser = Object.keys(activeUsers).find((value) => {
            return activeUsers[value].id === id;
        });
        //delay for 2 seconds to allow user to reconnect
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            //checks if the user has reconnected,
            //if not notify other user that they have left
            const sockets = yield socketIO.in(roomID).fetchSockets();
            const findRes = sockets.find((socket) => {
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
                clearInterval(counter.countdown);
                console.log("CLEAN GAME INFO", roomID);
                socketIO.emit("remove active game update", info);
                activeGames = activeGames.filter((activeGame) => activeGame.roomID !== info.roomID);
                cleanGameInfos();
            }
        }), 1500);
    }
});
socketIO.on("connection", (socket) => {
    ``;
    console.log("Connected!", socket.id, socketIO.of("/").sockets.size);
    socket.on("name probe", (userName) => {
        const nameExists = activeUsers[userName] !== undefined;
        socketIO.to(socket.id).emit("name probe response", nameExists);
    });
    socket.on("name register", (user) => {
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
    socket.on("matching", (user) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Matching request", user);
        while (true) {
            for (let i = 0; i < gameInfos.length; i++) {
                const info = gameInfos[i];
                const sockets = yield socketIO.in(info.roomID).fetchSockets();
                if (info.scores[0] + info.scores[1] !== info.winningScore &&
                    sockets.length < 2 &&
                    info.users.length < 2 &&
                    info.type === "matching") {
                    info.users.push(user);
                    socket.join(info.roomID);
                    gameInfos.forEach((gameInfo) => {
                        console.log(gameInfo === null || gameInfo === void 0 ? void 0 : gameInfo.roomID, gameInfo === null || gameInfo === void 0 ? void 0 : gameInfo.users[0], gameInfo === null || gameInfo === void 0 ? void 0 : gameInfo.users[1]);
                    });
                    return;
                }
            }
            console.log("full rooms, creating new room...");
            generateGameInfo("matching");
        }
    }));
    socket.on("unmatching", (user) => {
        console.log("Unmatching request", user);
        removeUser(user, (roomID) => socket.leave(roomID));
    });
    socket.on("invite request", ({ senderName, receiverName, inviteMessage, gameOptions, }) => {
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
        removeUser(activeUsers[senderName], (roomID) => socket.leave(roomID));
        info.users.push(activeUsers[senderName]);
        socket.join(info.roomID);
        socketIO.to(activeUsers[receiverName].id).emit("request incoming", {
            senderName: senderName,
            roomID: info.roomID,
            inviteMessage: inviteMessage,
        });
    });
    socket.on("invite reply", ({ senderName, receiverName, decision, }) => {
        //remove any expired invitation (by timeout)
        console.log("ACTIVE USERS", activeUsers);
        removeExpiredInvitation();
        //gets the most recent invitation of sender and receiver
        //(prevents multiple invitations of same pair of sender and receiver)
        const inviteInfo = getMostRecentInvitation(senderName, receiverName);
        const roomID = inviteInfo !== undefined ? inviteInfo.roomID : undefined;
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
        }
        else {
            //invitation was accepted
            if (decision) {
                console.log("request from", senderName, "accepted by", receiverName, socket.id);
                const info = getGameInfo(roomID);
                //removes user if they are in a room
                //(this can happen if player is matching and acccepted an invitation)
                removeUser(activeUsers[receiverName], (roomID) => socket.leave(roomID));
                info.users.push(activeUsers[receiverName]);
                socket.join(roomID);
                expireInvitation(senderName);
                //invitation was declined
            }
            else {
                console.log("request from", senderName, "declined by", receiverName, socket.id);
            }
        }
    });
    socket.on("active user request", () => {
        socketIO.to(socket.id).emit("active user update", activeUsers);
        console.log(Object.keys(activeUsers).length + " users are registered");
    });
    socket.on("chat request", ({ name, roomID }) => {
        var _a;
        //server selects and sends the chat history according to user status (online or in-game)
        //chat histories are private (different roomID will not have access to each other's chat history)
        //console.log("CHAT REQUEST ARG", name, roomID, activeUsers)
        if (((_a = activeUsers[name]) === null || _a === void 0 ? void 0 : _a.inGame) && roomID !== undefined) {
            socketIO
                .to(roomID)
                .emit("chat update", chatHistory.local[roomID]);
        }
        else {
            socketIO
                .except(gameInfos.map((gameInfo) => gameInfo.roomID))
                .emit("chat update", chatHistory.global);
        }
    });
    socket.on("chat message", ({ msg, name, roomID, }) => {
        var _a;
        //server selects and sends the chat history according to user status (online or in-game)
        //chat histories are private (different roomID will not have access to each other's chat history)
        if (((_a = activeUsers[name]) === null || _a === void 0 ? void 0 : _a.inGame) && roomID !== undefined) {
            chatHistory.local[roomID].push(msg);
            socketIO
                .to(roomID)
                .emit("chat update", chatHistory.local[roomID]);
        }
        else {
            chatHistory.global.push(msg);
            socketIO
                .except(gameInfos.map((gameInfo) => gameInfo.roomID))
                .emit("chat update", chatHistory.global);
        }
    });
    socket.on("admin clear chat", () => {
        chatHistory.global = [];
        socketIO
            .except(gameInfos.map((gameInfo) => gameInfo.roomID))
            .emit("chat update", chatHistory.global);
    });
    socket.on("admin reset game", (gameInfo) => {
        socketIO
            .to(gameInfo.roomID)
            .emit("gameInfo update", resetRoom(gameInfo.roomID));
        socketIO.emit("active game update", resetRoom(gameInfo.roomID));
    });
    socket.on("select block", ({ index, roomID, name, }) => {
        const info = getGameInfo(roomID);
        info.minesArray[index].selected = true;
        info.minesArray[index].selectedBy = name;
        if (info.minesArray[index].value === 1) {
            info.scores[info.playingUser] +=
                info.minesConfig[info.minesArray[index].type].points;
            socketIO.emit("active game update", info);
        }
        if (checkEndGame(roomID)) {
            socketIO.to(roomID).emit("end game", info);
            const counter = getCounter(roomID);
            clearInterval(counter.countdown);
            counter.countdown = false;
            info.timer = 10;
        }
        else {
            switchUser(roomID);
            info.timer = 10;
            socketIO.to(roomID).emit("gameInfo update", info);
        }
    });
    socket.on("pause/unpause", ({ roomID, requester }) => {
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
        }
        else {
            //pause
            console.log("[PAUSE]", roomID, requester);
            clearInterval(counter.countdown);
            counter.countdown = false;
            socketIO
                .to(info.roomID)
                .emit("pause/unpause update", { pause: true });
        }
    });
    socket.on("leave room request", (roomID) => {
        const updatedUser = Object.keys(activeUsers).find((key) => activeUsers[key].id === socket.id);
        if (updatedUser !== undefined) {
            activeUsers[updatedUser].inGame = false;
            socketIO.emit("active user update", activeUsers);
        }
        socket.leave(roomID);
        const counter = getCounter(roomID);
        if (counter)
            clearInterval(counter.countdown);
    });
    socket.on("reconnect game", ({ roomID }) => {
        if (activeUsers[socket.data.name] !== undefined) {
            socket.join(roomID);
        }
        else {
            console.log("active users not found", activeUsers[socket.data.name], socket.data.name);
        }
    });
    socket.on("play again", ({ gameInfo, requester, }) => {
        console.log("play again", gameInfo.roomID);
        socketIO.to(gameInfo.roomID).emit("rematch request", requester);
    });
    socket.on("rematch accepted", (roomID) => {
        const info = resetRoom(roomID);
        socketIO.to(roomID).emit("start game", info);
        resetCountdown(info, roomID);
    });
    socket.on("confetti", ({ targetPlayer }) => {
        if (activeUsers[targetPlayer] !== undefined) {
            console.log("[CONFETTI] sent from", socket.data.name, "to", targetPlayer);
            socket
                .to(activeUsers[targetPlayer].id)
                .emit("confetti from sender");
        }
    });
    socket.on("disconnect", () => {
        console.log(socket.data.name + " has disconnected", socketIO.of("/").sockets.size);
        delete activeUsers[socket.data.name];
        //prevents failing name probing users (no name user) from spamming active user update
        if (socket.data.name !== undefined)
            socketIO.emit("active user update", activeUsers);
    });
});

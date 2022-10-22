"use strict";
const uuid = require("uuid");
const app = require("express")();
const http = require("http").Server(app);
const socketIO = require("socket.io")(http, {
    cors: {
        origin: "*",
    },
});
const addSeconds = require("date-fns/addSeconds");
const compareAsc = require("date-fns/compareAsc");
const WINNING_SCORE = 3;
const createMinesArray = () => {
    let nums = new Set();
    while (nums.size < 11) {
        nums.add(Math.floor(Math.random() * 36 + 1));
    }
    const bombIndexes = [];
    nums.forEach((num) => bombIndexes.push(num));
    const arr = [...Array(36)].map((value, index) => {
        return bombIndexes.includes(index + 1)
            ? {
                selected: false,
                value: 1,
            }
            : {
                selected: false,
                value: 0,
            };
    });
    return arr;
};
const chooseRandomUser = () => {
    return Math.random() > 0.5 ? 1 : 0;
};
const generateID = () => {
    return uuid.v4();
};
const generateGameInfo = (gameInfos, counters) => {
    const id = generateID();
    counters.push({
        roomID: id,
        countdown: false,
    });
    gameInfos.push({
        roomID: id,
        timer: 10,
        users: [],
        playingUser: chooseRandomUser(),
        scores: [0, 0],
        minesArray: createMinesArray(),
    });
};
const resetRoom = (roomID) => {
    const info = getGameInfo(roomID);
    if (info !== undefined) {
        info.timer = 10;
        info.playingUser = chooseRandomUser();
        info.scores = [0, 0];
        info.minesArray = createMinesArray();
    }
    return info;
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
const removeRoomUser = (user, callback) => {
    let info = gameInfos.find((infoObj) => {
        if (infoObj.scores[0] + infoObj.scores[1] !== WINNING_SCORE) {
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
        console.log(info);
        callback(info.roomID);
    }
};
const switchUser = (roomID) => {
    const info = getGameInfo(roomID);
    const newPlayingUser = Number(!Boolean(info.playingUser));
    info.playingUser = newPlayingUser;
};
const checkEndGame = (roomID) => {
    const info = getGameInfo(roomID);
    return info.scores[0] + info.scores[1] === WINNING_SCORE;
};
let chatHistory = [];
let activeUsers = {};
const initialRoomID = generateID();
let counters = [
    {
        roomID: initialRoomID,
        countdown: false,
    },
];
let gameInfos = [
    {
        roomID: initialRoomID,
        timer: 10,
        users: [],
        playingUser: chooseRandomUser(),
        scores: [0, 0],
        minesArray: createMinesArray(),
    },
];
app.get("/", function (res) {
    res.sendFile(__dirname + "/index.html");
});
http.listen(9000, "0.0.0.0", () => {
    console.log("listening on *:9000");
});
socketIO.of("/").adapter.on("join-room", (roomID, id) => {
    console.log(`${id} has joined room ${roomID}`);
    if (roomID.length > 20) {
        const info = getGameInfo(roomID);
        if (info.users.length === 2) {
            console.log("starting game for room ", info.roomID);
            socketIO.to(info.roomID).emit("start game", info);
            const counter = getCounter(info.roomID);
            if (!counter.countdown) {
                console.log("set countdown");
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
socketIO.of("/").adapter.on("leave-room", (roomID, id) => {
    console.log(`${id} has left room ${roomID}`);
    if (roomID.length > 20) {
        socketIO.to(roomID).emit("other user left");
    }
});
socketIO.on("connection", (socket) => {
    console.log("Connected!", socket.id, socketIO.of("/").sockets.size);
    socket.on("name register", (user) => {
        activeUsers[user.name] = user.id;
        socketIO.emit("active user update", activeUsers);
    });
    socket.on("matching", (user) => {
        console.log("Matching request", user);
        while (true) {
            for (let i = 0; i < gameInfos.length; i++) {
                const info = gameInfos[i];
                if (info.scores[0] + info.scores[1] !== WINNING_SCORE &&
                    info.users.length < 2) {
                    info.users.push(user);
                    socket.join(info.roomID);
                    console.log(gameInfos);
                    return;
                }
            }
            console.log("full rooms, creating new room...");
            generateGameInfo(gameInfos, counters);
        }
    });
    socket.on("unmatching", (user) => {
        console.log("Unmatching request", user);
        removeRoomUser(user, (roomID) => socket.leave(roomID));
    });
    socket.on("chat message", ({ msg, name }) => {
        chatHistory.push({
            from: name,
            message: msg,
            at: Date.now(),
        });
        socketIO.emit("chat update", chatHistory);
    });
    socket.on("active user request", () => {
        socketIO.emit("active user update", activeUsers);
        console.log(Object.keys(activeUsers).length + " users are registered");
    });
    socket.on("chat request", () => {
        socketIO.emit("chat update", chatHistory);
    });
    socket.on("select block", ({ index, roomID }) => {
        const info = getGameInfo(roomID);
        info.minesArray[index].selected = true;
        if (info.minesArray[index].value === 1) {
            info.scores[info.playingUser]++;
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
    socket.on("leave room request", (roomID) => {
        socket.leave(roomID);
        socketIO.to(roomID).emit("other user left");
    });
    socket.on("reconnect game", ({ roomID }) => {
        socket.join(roomID);
    });
    socket.on("play again", ({ gameInfo, requester, }) => {
        const { roomID } = gameInfo;
        console.log("play again", roomID);
        socketIO.to(roomID).emit("rematch request", requester);
    });
    socket.on("rematch accepted", (roomID) => {
        const info = resetRoom(roomID);
        socketIO.to(roomID).emit("start game", info);
        resetCountdown(info, roomID);
    });
    socket.on("disconnect", () => {
        const user = Object.keys(activeUsers).find((key) => activeUsers[key] === socket.id);
        if (user !== undefined) {
            console.log(user + " has left the chat");
            delete activeUsers[user];
        }
        socketIO.emit("active user update", activeUsers);
    });
});

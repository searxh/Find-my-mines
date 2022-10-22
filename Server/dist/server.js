"use strict";
const uuid = require("uuid");
const app = require("express")();
const http = require("http").Server(app);
const socketIO = require("socket.io")(http, {
    cors: {
        origin: "*"
    }
});
const addSeconds = require("date-fns/addSeconds");
const compareAsc = require("date-fns/compareAsc");
const WINNING_SCORE = 2100;
const createMinesArray = () => {
    let nums = new Set();
    while (nums.size < 11) {
        nums.add(Math.floor(Math.random() * 36));
    }
    const types = generateTypesIndexesFrom([1, 2, 3, 5], [...nums]);
    const bombIndexes = [];
    nums.forEach((num) => bombIndexes.push(num));
    const arr = [...Array(36)].map((value, index) => {
        return bombIndexes.includes(index) ?
            {
                selected: false,
                value: 1,
                type: types[index],
            } : {
            selected: false,
            value: 0,
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
            types[arr[selectedNum]] = index === 0 ? "Legendary" :
                index === 1 ? "Epic" :
                    index === 2 ? "Rare" :
                        index === 3 ? "Common"
                            : null;
            arr = arr.filter((num) => num !== arr[selectedNum]);
        }
    });
    return types;
};
const getRandomInt = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
};
const chooseRandomUser = () => {
    return Math.random() > 0.5 ? 1 : 0;
};
const generateID = () => {
    return uuid.v4();
};
const generateGameInfo = (type, roomID) => {
    const id = roomID !== undefined ? roomID : generateID();
    const newGameInfo = {
        roomID: id,
        type: type,
        timer: 10,
        users: [],
        playingUser: chooseRandomUser(),
        scores: [0, 0],
        minesArray: createMinesArray(),
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
        info.minesArray = createMinesArray();
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
const removeUser = (user, callback) => {
    let info = gameInfos.find((infoObj) => {
        if (infoObj.scores[0] + infoObj.scores[1] !== WINNING_SCORE) {
            return infoObj.users.find((userObj) => userObj.name === user.name) !== undefined;
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
        if (gameInfo.scores[0] + gameInfo.scores[1] === WINNING_SCORE) {
            delete chatHistory.local[gameInfo.roomID];
            return false;
        }
        else {
            return true;
        }
    });
    console.log('cleared unused rooms', gameInfos);
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
const addInvitation = (key, value) => {
    invitation[key] = value;
};
const removeExpiredInvitation = () => {
    const expiredKeys = Object.keys(invitation)
        .filter((key) => compareAsc(Date.now(), invitation[key].validUntil) === 1 ? true : false);
    console.log("EXPIRED_KEYS", expiredKeys);
    expiredKeys.forEach((key) => {
        const roomID = invitation[key].roomID;
        const info = getGameInfo(roomID);
        console.log("INFO USER LENGTH AUTO EXPIRE", info.users);
        //removes the room that is created as well if room doesn't have 2 people
        if (info.users.length < 2)
            removeRoom(roomID);
        delete invitation[key];
    });
    console.log("FILTERED EXPIRED", invitation);
};
const expireInvitation = (senderName) => {
    const expiredKeys = Object.keys(invitation)
        .filter((key) => invitation[key].senderName === senderName);
    if (expiredKeys !== undefined) {
        expiredKeys.forEach((key) => {
            const roomID = invitation[key].roomID;
            const info = getGameInfo(roomID);
            console.log("INFO USER LENGTH MANUAL EXPIRE", info.users);
            //removes the room that is created as well if room doesn't have 2 people
            if (info.users.length < 2)
                removeRoom(roomID);
            delete invitation[key];
        });
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
let chatHistory = {
    global: [],
    local: {},
};
let activeUsers = {};
let invitation = {};
const initialRoomID = generateID();
chatHistory.local[initialRoomID] = [];
let counters = [
    {
        roomID: initialRoomID,
        countdown: false
    }
];
let gameInfos = [
    {
        roomID: initialRoomID,
        type: "matching",
        timer: 10,
        users: [],
        playingUser: chooseRandomUser(),
        scores: [0, 0],
        minesArray: createMinesArray(),
    }
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
            info.users.forEach((user) => {
                activeUsers[user.name].inGame = true;
            });
            socketIO.to(info.roomID).emit("start game", info);
            setTimeout(() => socketIO.emit("active user update", activeUsers), 500);
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
    //only for leave events that are game room ids
    if (roomID.length > 20) {
        //saves the name of the user according to id
        //(since id will change after reconnect)
        const saveUser = Object.keys(activeUsers).find((value) => {
            return activeUsers[value].id === id;
        });
        //delay for 2 seconds to allow user to reconnect
        setTimeout(() => {
            //checks if the user has reconnected, 
            //if not notify other user that they have left
            if (activeUsers[saveUser] === undefined ||
                activeUsers[saveUser].inGame === false)
                socketIO.to(roomID).emit("other user left");
        }, 1500);
    }
});
socketIO.on("connection", (socket) => {
    console.log("Connected!", socket.id, socketIO.of("/").sockets.size);
    socket.on("name register", (user) => {
        activeUsers[user.name] = { id: user.id, name: user.name, inGame: user.inGame };
        socketIO.emit("active user update", activeUsers);
    });
    socket.on("matching", (user) => {
        console.log("Matching request", user);
        while (true) {
            for (let i = 0; i < gameInfos.length; i++) {
                const info = gameInfos[i];
                if ((info.scores[0] + info.scores[1] !== WINNING_SCORE)
                    && (info.users.length < 2) && info.type === "matching") {
                    info.users.push(user);
                    socket.join(info.roomID);
                    console.log(gameInfos);
                    return;
                }
            }
            console.log("full rooms, creating new room...");
            cleanGameInfos();
            generateGameInfo("matching");
        }
    });
    socket.on("unmatching", (user) => {
        console.log("Unmatching request", user);
        removeUser(user, (roomID) => socket.leave(roomID));
    });
    socket.on("invite request", ({ senderName, receiverName }) => {
        const roomID = generateID();
        addInvitation(roomID, {
            roomID: roomID,
            senderName: senderName,
            receiverName: receiverName,
            validUntil: addSeconds(Date.now(), 15)
        });
        console.log("INVITATION", invitation);
        const info = generateGameInfo("invitation", roomID);
        //removes user if they are in a room
        //(this can happen if player is matching and acccepted an invitation)
        removeUser(activeUsers[senderName], (roomID) => socket.leave(roomID));
        info.users.push(activeUsers[senderName]);
        socket.join(roomID);
        socketIO.to(activeUsers[receiverName].id).emit("request incoming", {
            senderName: senderName,
            roomID: roomID,
        });
    });
    socket.on("invite reply", ({ senderName, receiverName, decision }) => {
        //remove any expired invitation (by timeout)
        removeExpiredInvitation();
        //gets the most recent invitation of sender and receiver 
        //(prevents multiple invitations of same pair of sender and receiver)
        const inviteInfo = getMostRecentInvitation(senderName, receiverName);
        const roomID = inviteInfo !== undefined ? inviteInfo.roomID : undefined;
        socketIO.to(roomID).emit("reply incoming", {
            receiverName: receiverName,
            decision: decision
        });
        //no invitation was found (expired)
        if (roomID === undefined) {
            setTimeout(() => socketIO.to(activeUsers[receiverName].id)
                .emit("request incoming", { error: true }), 300);
            //tear down room because invitation was expired
            socketIO.socketsLeave(roomID);
            //manually expire all invitation of one sender (since invitation was successful)
            expireInvitation(senderName);
            //invitation was found
        }
        else {
            //invitation was accepted
            if (decision) {
                console.log('request from', senderName, 'accepted by', receiverName, socket.id);
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
                console.log('request from', senderName, 'declined by', receiverName, socket.id);
                //tear down room because invitation was declined
                socketIO.socketsLeave(roomID);
            }
            cleanGameInfos();
        }
    });
    socket.on("active user request", () => {
        socketIO.emit("active user update", activeUsers);
        console.log(Object.keys(activeUsers).length + " users are registered");
    });
    socket.on("chat message", ({ msg, name, roomID }) => {
        //server selects and sends the chat history according to user status (online or in-game)
        //chat histories are private (different roomID will not have access to each other's chat history)
        if (activeUsers[name].inGame && roomID !== undefined) {
            chatHistory.local[roomID].push(msg);
            socketIO.to(roomID).emit("chat update", chatHistory.local[roomID]);
        }
        else {
            chatHistory.global.push(msg);
            socketIO.except(gameInfos.map((gameInfo) => gameInfo.roomID))
                .emit("chat update", chatHistory.global);
        }
    });
    socket.on("chat request", ({ name, roomID }) => {
        //server selects and sends the chat history according to user status (online or in-game)
        //chat histories are private (different roomID will not have access to each other's chat history)
        console.log("CHAT REQUEST ARG", name, roomID);
        if (activeUsers[name].inGame && roomID !== undefined) {
            socketIO.to(roomID).emit("chat update", chatHistory.local[roomID]);
        }
        else {
            socketIO.except(gameInfos.map((gameInfo) => gameInfo.roomID))
                .emit("chat update", chatHistory.global);
        }
    });
    socket.on("select block", ({ index, roomID }) => {
        const info = getGameInfo(roomID);
        info.minesArray[index].selected = true;
        if (info.minesArray[index].value === 1) {
            let score = 0;
            switch (info.minesArray[index].type) {
                case "Legendary":
                    score = 400;
                    break;
                case "Epic":
                    score = 300;
                    break;
                case "Rare":
                    score = 200;
                    break;
                case "Common":
                    score = 100;
                    break;
                default:
                    console.log("[ERROR] SELECT BLOCK NO TYPE");
                    break;
            }
            info.scores[info.playingUser] += score;
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
        const updatedUser = Object.keys(activeUsers).find((key) => activeUsers[key].id === socket.id);
        if (updatedUser !== undefined) {
            activeUsers[updatedUser].inGame = false;
            socketIO.emit("active user update", activeUsers);
        }
        socket.leave(roomID);
    });
    socket.on("reconnect game", ({ roomID }) => {
        //delay to allow active users array to update before joining room
        setTimeout(() => socket.join(roomID), 500);
    });
    socket.on("play again", ({ gameInfo, requester }) => {
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
        const user = Object.keys(activeUsers).find((key) => activeUsers[key].id === socket.id);
        if (user !== undefined) {
            console.log(user + " has disconnected", socketIO.of("/").sockets.size);
            delete activeUsers[user];
        }
        socketIO.emit("active user update", activeUsers);
    });
});

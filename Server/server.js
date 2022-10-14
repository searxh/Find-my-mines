"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var uuid = require('uuid');
var app = require('express')();
var http = require('http').Server(app);
var socketIO = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});
var WINNING_SCORE = 2;
var createMinesArray = function () {
    var nums = new Set();
    while (nums.size < 11) {
        nums.add(Math.floor(Math.random() * 36 + 1));
    }
    var bombIndexes = [];
    nums.forEach(function (num) { return bombIndexes.push(num); });
    var arr = __spreadArray([], Array(36), true).map(function (value, index) {
        return bombIndexes.includes(index + 1) ?
            {
                selected: false,
                value: 1
            } : {
            selected: false,
            value: 0
        };
    });
    return arr;
};
var chooseRandomUser = function () {
    return Math.random() > 0.5 ? 1 : 0;
};
var generateID = function () {
    return uuid.v4();
};
var generateGameInfo = function (gameInfo, counter) {
    var id = generateID();
    counter.push({
        roomID: id,
        countdown: false
    });
    gameInfo.push({
        roomID: id,
        timer: 10,
        users: [],
        playingUser: chooseRandomUser(),
        scores: [0, 0],
        minesArray: createMinesArray()
    });
};
var resetRoom = function (roomID) {
    var info = getGameInfo(roomID);
    info.timer = 10;
    info.playingUser = chooseRandomUser();
    info.scores = [0, 0];
    info.minesArray = createMinesArray();
    return info;
};
var resetCountdown = function (info, roomID) {
    var counter = getCounter(roomID);
    if (counter !== undefined) {
        counter.countdown = setInterval(function () {
            socketIO.to(roomID).emit('counter', info.timer);
            info.timer--;
            if (info.timer === -1) {
                switchUser(roomID);
                info.timer = 10;
                socketIO.to(roomID).emit('gameInfo update', info);
            }
        }, 1000);
    }
};
var getGameInfo = function (roomID) {
    return gameInfo.find(function (info) { return info.roomID === roomID; });
};
var getCounter = function (roomID) {
    return counter.find(function (counterObj) { return counterObj.roomID === roomID; });
};
var removeRoomUser = function (user, callback) {
    var info = gameInfo.find(function (infoObj) {
        if (infoObj.scores[0] + infoObj.scores[1] !== WINNING_SCORE) {
            return infoObj.users.find(function (userObj) { return userObj.name === user.name; }) !== undefined;
        }
        else {
            return false;
        }
    });
    if (info === undefined) {
        console.log('undefined info');
    }
    else {
        info.users = info.users.filter(function (userObj) { return user.name !== userObj.name; });
        console.log(info);
        callback(info.roomID);
    }
};
var switchUser = function (roomID) {
    var info = getGameInfo(roomID);
    var newPlayingUser = Number(!Boolean(info.playingUser));
    info.playingUser = newPlayingUser;
};
var checkEndGame = function (roomID) {
    var info = getGameInfo(roomID);
    return info.scores[0] + info.scores[1] === WINNING_SCORE;
};
var chatHistory = [];
var activeUsers = [];
var initialRoomID = generateID();
var counter = [{
        roomID: initialRoomID,
        countdown: false
    }];
var gameInfo = [{
        roomID: initialRoomID,
        timer: 10,
        users: [],
        playingUser: chooseRandomUser(),
        scores: [0, 0],
        minesArray: createMinesArray()
    }];
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
http.listen(9000, '0.0.0.0', function () {
    console.log('listening on *:9000');
});
socketIO.on('connection', function (socket) {
    console.log('Connected!', socket.id, socketIO.engine.clientsCount);
    socket.on('name register', function (user) {
        console.log('new user has registered');
        activeUsers.push(user);
    });
    socket.on('matching', function (user) {
        console.log('Matching request', user);
        while (true) {
            for (var i = 0; i < gameInfo.length; i++) {
                var info = gameInfo[i];
                if ((info.scores[0] + info.scores[1] !== WINNING_SCORE) && info.users.length < 2) {
                    info.users.push(user);
                    socket.join(info.roomID);
                    console.log(gameInfo);
                    return;
                }
            }
            console.log('full rooms, creating new room...');
            generateGameInfo(gameInfo, counter);
        }
    });
    socket.on('unmatching', function (user) {
        console.log('Unmatching request', user);
        removeRoomUser(user, function (roomID) { return socket.leave(roomID); });
    });
    socket.on('chat message', function (_a) {
        var msg = _a.msg, name = _a.name, id = _a.id;
        var userIndex = activeUsers.findIndex(function (user) { return user.name === name; });
        activeUsers[userIndex].id = id;
        if (userIndex !== undefined) {
            chatHistory.push({
                from: activeUsers[userIndex].name,
                message: msg,
                at: Date.now()
            });
            socketIO.emit('chat update', chatHistory);
        }
    });
    socket.on('active user request', function () {
        socketIO.emit('active user update', activeUsers);
        console.log(activeUsers.length + ' users are registered');
    });
    socket.on('chat request', function () {
        socketIO.emit('chat update', chatHistory);
    });
    socket.on('select block', function (_a) {
        var index = _a.index, roomID = _a.roomID;
        var info = getGameInfo(roomID);
        info.minesArray[index].selected = true;
        if (info.minesArray[index].value === 1) {
            info.scores[info.playingUser]++;
        }
        if (checkEndGame(roomID)) {
            socketIO.to(roomID).emit('end game', info);
            var counter_1 = getCounter(roomID);
            clearInterval(counter_1.countdown);
            counter_1.countdown = false;
            info.timer = 10;
        }
        else {
            switchUser(roomID);
            info.timer = 10;
            socketIO.to(roomID).emit('gameInfo update', info);
        }
    });
    socket.on('leave room request', function (roomID) {
        socket.leave(roomID);
        socketIO.to(roomID).emit("other user left");
    });
    socket.adapter.on("join-room", function (roomID, id) {
        console.log("socket ".concat(id, " has joined room ").concat(roomID));
        //prevents socketID rooms
        if (roomID.length > 20) {
            var info_1 = getGameInfo(roomID);
            if (info_1.users.length === 2) {
                console.log("starting game for room ", roomID);
                socketIO.to(roomID).emit('start game', info_1);
                var counter_2 = getCounter(roomID);
                if (!counter_2.countdown) {
                    console.log('set countdown');
                    counter_2.countdown = setInterval(function () {
                        socketIO.to(roomID).emit('counter', info_1.timer);
                        info_1.timer--;
                        if (info_1.timer === -1) {
                            switchUser(roomID);
                            info_1.timer = 10;
                            socketIO.to(roomID).emit('gameInfo update', info_1);
                        }
                    }, 1000);
                }
            }
        }
    });
    socket.adapter.on('leave-room', function (roomID, id) {
        console.log("socket ".concat(id, " has left room ").concat(roomID));
        socketIO.to(roomID).emit("other user left");
    });
    socket.on('play again', function (_a) {
        var gameInfo = _a.gameInfo, requester = _a.requester;
        var roomID = gameInfo.roomID;
        console.log('play again', roomID);
        socketIO.to(roomID).emit('rematch request', requester);
    });
    socket.on('rematch accepted', function (roomID) {
        var info = resetRoom(roomID);
        socketIO.to(roomID).emit('start game', info);
        resetCountdown(info, roomID);
    });
    socket.on('disconnect', function () {
        var leftUser = activeUsers.find(function (user) { return user.id === socket.id; });
        if (leftUser !== undefined)
            console.log(leftUser.name + ' has left the chat');
        activeUsers = activeUsers.filter(function (user) { return (user.id !== socket.id); });
        socketIO.emit('active user update', activeUsers);
    });
});

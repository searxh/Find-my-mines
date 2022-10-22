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
const WINNING_SCORE = 21;
const createMinesArray = () => {
	let nums = new Set();
	while (nums.size < 11) {
		nums.add(Math.floor(Math.random() * 36));
	}
	const types = generateTypesIndexesFrom([1, 2, 3, 5], [...nums]);
	const bombIndexes = [];
	nums.forEach((num) => bombIndexes.push(num));
	const arr = [...Array(36)].map((value, index) => {
		return bombIndexes.includes(index)
			? {
					selected: false,
					value: 1,
					type: types[index],
			  }
			: {
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
const getRandomInt = (min, max) => {
	return Math.round(Math.random() * (max - min) + min);
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
		type: type,
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
			return (
				infoObj.users.find((userObj) => userObj.name === user.name) !==
				undefined
			);
		} else {
			return false;
		}
	});
	if (info === undefined) {
		console.log("undefined info");
	} else {
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
			if (
				activeUsers[saveUser] === undefined ||
				activeUsers[saveUser].inGame === false
			)
				socketIO.to(roomID).emit("other user left");
		}, 1500);
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
				if (
					info.scores[0] + info.scores[1] !== WINNING_SCORE &&
					info.users.length < 2
				) {
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
		removeUser(user, (roomID) => socket.leave(roomID));
	});
	socket.on("invite request", ({ senderName, receiverName }) => {
		const roomID = generateID();
		addInvitation(roomID, {
			roomID: roomID,
			senderName: senderName,
			receiverName: receiverName,
			validUntil: addSeconds(Date.now(), 15),
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
	socket.on("chat message", ({ msg, name }) => {
		chatHistory.push({
			from: name,
			message: msg,
			at: Date.now(),
		});
		//no invitation was found (expired)
		if (roomID === undefined) {
			setTimeout(
				() =>
					socketIO
						.to(activeUsers[receiverName].id)
						.emit("request incoming", { error: true }),
				300
			);
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
				removeUser(activeUsers[receiverName], (roomID) => socket.leave(roomID));
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
	socket.on("chat request", () => {
		socketIO.emit("chat update", chatHistory);
	});
	socket.on("select block", ({ index, roomID }) => {
		const info = getGameInfo(roomID);
		info.minesArray[index].selected = true;
		if (info.minesArray[index].value === 1) {
			let score = 0;
			switch (info.minesArray[index].type) {
				case "Legendary":
					score = 4;
					break;
				case "Epic":
					score = 3;
					break;
				case "Rare":
					score = 2;
					break;
				case "Common":
					score = 1;
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
		} else {
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
		const user = Object.keys(activeUsers).find(
			(key) => activeUsers[key] === socket.id
		);
		if (user !== undefined) {
			console.log(user + " has left the chat");
			delete activeUsers[user];
		}
		socketIO.emit("active user update", activeUsers);
	});
});

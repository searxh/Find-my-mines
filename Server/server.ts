"use strict";
const uuid = require('uuid');
const app = require('express')();
const http = require('http').Server(app);
const socketIO = require('socket.io')(http,{
    cors: {
      origin: '*'
    }
});

const WINNING_SCORE = 3;
const createMinesArray = () => {
    let nums = new Set<number>();
    while (nums.size < 11) {
        nums.add(Math.floor(Math.random()*36+1));
    }
    const bombIndexes:Array<number> = [];
    nums.forEach((num:number)=>bombIndexes.push(num));
    const arr = [...Array(36)].map((value:number,index:number)=>{
        return bombIndexes.includes(index+1)?
            {
                selected:false,
                value:1
            }:{
                selected:false,
                value:0
            };
        
    });
    return arr;
};
const chooseRandomUser = () => {
    return Math.random()>0.5?1:0
};
const generateID = ():string => {
    return uuid.v4()
};
const generateGameInfo = (gameInfos:Array<GameInfoType>,counters:Array<CounterType>) => {
    const id = generateID()
    counters.push({
        roomID:id,
        countdown:false,
    })
    gameInfos.push({
        roomID:id,
        timer:10,
        users:[],
        playingUser:chooseRandomUser(),
        scores:[0,0],
        minesArray:createMinesArray(),
    })
};
const resetRoom = (roomID:string) => {
    const info = getGameInfo(roomID)
    if (info !== undefined) {
        info.timer = 10
        info.playingUser = chooseRandomUser()
        info.scores = [0,0]
        info.minesArray = createMinesArray()
    }
    return info
};
const resetCountdown = (info:GameInfoType,roomID:string) => {
    const counter = getCounter(roomID)
    if (counter !== undefined) {
        counter.countdown = setInterval(()=>{
            socketIO.to(roomID).emit('counter', info.timer)
            info.timer--
            if (info.timer === -1) {
                switchUser(roomID)
                info.timer = 10
                socketIO.to(roomID).emit('gameInfo update',info)
            }
        }, 1000)
    }
};
const getGameInfo = (roomID:string) => {
    return gameInfos.find((info:GameInfoType)=>info.roomID === roomID) as GameInfoType
};
const getCounter = (roomID:string) => {
    return counters.find((counterObj:CounterType)=>counterObj.roomID === roomID) as CounterType
};
const removeRoomUser = (user:UserType,callback:Function) => {
    let info = gameInfos.find((infoObj:GameInfoType)=>{
        if (infoObj.scores[0]+infoObj.scores[1] !== WINNING_SCORE) {
            return infoObj.users.find((userObj:UserType)=>userObj.name===user.name)!==undefined
        } else {
            return false
        }
    })
    if (info === undefined) {
        console.log('undefined info')
    } else {
        info.users = info.users.filter((userObj:UserType)=>user.name!==userObj.name)
        console.log(info)
        callback(info.roomID)
    }
};
const switchUser = (roomID:string) => {
    const info = getGameInfo(roomID);
    const newPlayingUser = Number(!Boolean(info.playingUser));
    info.playingUser = newPlayingUser;
};
const checkEndGame = (roomID:string) => {
    const info = getGameInfo(roomID);
    return info.scores[0]+info.scores[1]===WINNING_SCORE;
};
let chatHistory:Array<MessageType> = [];
let activeUsers:any= {};
const initialRoomID = generateID();
let counters:Array<CounterType> = [
    {
        roomID:initialRoomID,
        countdown:false
    }
];
let gameInfos:Array<GameInfoType> = [
    {
        roomID:initialRoomID,
        timer:10,
        users:[] as Array<UserType>,
        playingUser:chooseRandomUser() as number,
        scores:[0,0],
        minesArray:createMinesArray() as Array<BlockType>,
    }
];

app.get('/', function(res:any) {
    res.sendFile(__dirname + '/index.html');
});

http.listen(9000,'0.0.0.0', ()=>{
   console.log('listening on *:9000');
});

socketIO.of("/").adapter.on('join-room',(roomID:string,id:string) => {
    console.log(`${id} has joined room ${roomID}`)
    if (roomID.length > 20) {
        const info = getGameInfo(roomID)
        if (info.users.length === 2) {
            console.log("starting game for room ",info.roomID)
            info.users.forEach((user) => {
				activeUsers[user.name].inGame = true;
			});
            socketIO.to(info.roomID).emit('start game',info)
            setTimeout(()=>socketIO.emit("active user update", activeUsers), 500)
            const counter = getCounter(info.roomID)
            if (!counter.countdown) {
                console.log('set countdown')
                counter.countdown = setInterval(()=>{
                    socketIO.to(info.roomID).emit('counter', info.timer)
                    info.timer--
                    if (info.timer === -1) {
                        switchUser(info.roomID)
                        info.timer = 10
                        socketIO.to(info.roomID).emit('gameInfo update',info)
                    }
                }, 1000)
            }
        }
    }
});

socketIO.of("/").adapter.on('leave-room',(roomID:string,id:string) => {
    console.log(`${id} has left room ${roomID}`)
    if (roomID.length > 20) {
        socketIO.to(roomID).emit("other user left")
    }
});

socketIO.on('connection', (socket:any)=>{
    console.log('Connected!',socket.id, socketIO.of("/").sockets.size)
    socket.on('name register', (user:UserType)=>{
        activeUsers[user.name] = { id:user.id, name:user.name, inGame:user.inGame };
		socketIO.emit("active user update", activeUsers);
    })
    socket.on('matching',(user:UserType)=>{
        console.log('Matching request',user)
        while (true) {
            for (let i = 0; i < gameInfos.length; i++) {
                const info = gameInfos[i]
                if ((info.scores[0]+info.scores[1] !== WINNING_SCORE) && info.users.length < 2) {
                    info.users.push(user)
                    socket.join(info.roomID)
                    console.log(gameInfos)
                    return
                }
            }
            console.log('full rooms, creating new room...')
            generateGameInfo(gameInfos,counters)
        }
    });
    socket.on('unmatching',(user:UserType)=>{
        console.log('Unmatching request',user)
        removeRoomUser(user,(roomID:string)=>socket.leave(roomID))
    });
    socket.on('chat message', ({ msg, name }:{ msg:string, name:string })=>{
        chatHistory.push({ 
            from:name,
            message:msg,
            at:Date.now()
        })
        socketIO.emit('chat update', chatHistory)
    });
    socket.on('active user request', ()=>{
        socketIO.emit('active user update', activeUsers)
        console.log(Object.keys(activeUsers).length+' users are registered')
    });
    socket.on('chat request', ()=>{
        socketIO.emit('chat update', chatHistory)
    });
    socket.on('select block', ({ 
        index, roomID
    }:{ 
        index:number, roomID:string
    })=>{
        const info = getGameInfo(roomID) 
        info.minesArray[index].selected = true
        if (info.minesArray[index].value === 1) {
           info.scores[info.playingUser]++
        }
        if (checkEndGame(roomID)) {
            socketIO.to(roomID).emit('end game',info)
            const counter = getCounter(roomID)
            clearInterval(counter.countdown as ReturnType<typeof setInterval>)
            counter.countdown = false
            info.timer = 10
        } else {
            switchUser(roomID)
            info.timer = 10
            socketIO.to(roomID).emit('gameInfo update',info)
        }
    })
    socket.on('leave room request',(roomID:string)=>{
        const updatedUser = Object.keys(activeUsers).find(
            (key)=>activeUsers[key].id===socket.id
        )
        if (updatedUser !== undefined) {
            activeUsers[updatedUser].inGame = false
		    socketIO.emit("active user update", activeUsers)
        }
		socket.leave(roomID);
    })
    socket.on('reconnect game',({ roomID }:{ roomID:string })=>{
        socket.join(roomID)
    })
    socket.on('play again', ({ 
        gameInfo, requester
    }:{ 
        gameInfo:GameInfoType, requester:UserType
    })=>{
        const { roomID } = gameInfo
        console.log('play again',roomID)
        socketIO.to(roomID).emit('rematch request', requester)
    })
    socket.on('rematch accepted', (roomID:string)=>{
        const info = resetRoom(roomID)
        socketIO.to(roomID).emit('start game',info)
        resetCountdown(info,roomID)
    })
    socket.on('disconnect', ()=>{
        const user = Object.keys(activeUsers).find(
            (key:any)=>activeUsers[key].id===socket.id
        )
        if (user !== undefined) {
            console.log(user+ ' has disconnected', socketIO.of("/").sockets.size)
            delete activeUsers[user]
        }
        socketIO.emit('active user update', activeUsers)
    })
})
interface MessageType {
    from:string;
    message:string;
    at:string | number;
}
interface BlockType {
    selected:boolean;
    value:number;
}
interface UserType {
    name:string;
    id:string;
    inGame:boolean;
}
interface GameInfoType {
    roomID:string;
    timer:number;
    users:Array<UserType>;
    playingUser:number;
    scores:Array<number>;
    minesArray:Array<BlockType>;
}
interface CounterType {
    roomID:string;
    countdown: ReturnType<typeof setInterval> | boolean;
}
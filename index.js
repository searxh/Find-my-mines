require('dotenv').config()
const uuid = require('uuid')
const app = require('express')()
const http = require('http').Server(app)
const socketIO = require('socket.io')(http,{
    cors: {
      origin: '*'
    }
  })

const createMinesArray = () => {
    let nums = new Set();
    while (nums.size < 11) {
        nums.add(Math.floor(Math.random()*36+1));
    }
    const bombIndexes = [...nums]
    const arr = [...Array(36)].map((value,index)=>{
        return bombIndexes.includes(index+1)?
            {
                selected:false,
                value:1
            }:{
                selected:false,
                value:0
            }
    })
    return arr
}
const chooseRandomUser = () => {
    return Math.random()>0.5?1:0
}

const generateID = () => {
    return uuid.v4()
}

const generateGameInfo = (arr) => {
    arr.push({
        roomID:generateID(),
        users:[],
        playingUser:chooseRandomUser(),
        scores:[0,0],
        minesArray:createMinesArray(),
    })
}

const getGameInfo = (roomID) => {
    return gameInfo.find((info)=>info.roomID === roomID)
}

const switchUser = (roomID) => {
    const info = getGameInfo(roomID)
    const newPlayingUser = Number(!Boolean(info.playingUser))
    info.playingUser = newPlayingUser
}

const checkEndGame = (roomID) => {
    const info = getGameInfo(roomID)
    return info.scores[0]+info.scores[1]===1
}

let chatHistory = []
let activeUsers = []
let matchingUsers = []
let countdown = null
let timer = 10
let gameInfo = [{
    roomID:generateID(),
    users:[],
    playingUser:chooseRandomUser(),
    scores:[0,0],
    minesArray:createMinesArray(),
}]

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
})

http.listen(9000,'0.0.0.0', ()=>{
   console.log('listening on *:9000')
})

socketIO.on('connection', (socket)=>{
    console.log('Connected!',socket.id,socketIO.engine.clientsCount)
    socket.on('name register', (user)=>{
        console.log('new user has registered')
        activeUsers.push(user)
    })
    socket.on('matching',(user)=>{
        console.log('Matching request',user,matchingUsers)
        matchingUsers.push(user)
        while (true) {
            for (let i = 0; i < gameInfo.length; i++) {
                const info = gameInfo[i]
                if (info.users.length < 2) {
                    info.users = matchingUsers
                    if (info.users.find((tempUser)=>tempUser.name===user.name)!==undefined) {
                        socket.join(info.roomID)
                        console.log('exit while loop')
                        return
                    }
                }
            }
            console.log('full rooms, creating new room...')
            generateGameInfo(gameInfo)
        }
    })
    socket.on('unmatching',(user)=>{
        console.log('Unmatching request',user)
        matchingUsers = matchingUsers.filter((userObj)=>user.name!==userObj.name)
    })
    socket.on('chat message', ({ msg, name, id })=>{
        const userIndex = activeUsers.findIndex((user)=>user.name===name)
        activeUsers[userIndex].id = id
        if (userIndex !== undefined) {
            chatHistory.push({ 
                from:activeUsers[userIndex].name, 
                message:msg, 
                at:Date.now()
            })
            socketIO.emit('chat update', chatHistory)
        }
    })
    socket.on('active user request', ()=>{
        socketIO.emit('active user update', activeUsers)
        console.log(activeUsers.length+' users are registered')
    })
    socket.on('chat request', ()=>{
        socketIO.emit('chat update', chatHistory)
    })
    socket.on('select block', ({ index, roomID })=>{
        const info = getGameInfo(roomID) 
        info.minesArray[index].selected = true
        if (info.minesArray[index].value === 1) {
           info.scores[info.playingUser]++
        }
        if (checkEndGame(roomID)) {
            socketIO.to(roomID).emit('end game',info)
            clearInterval(countdown)
            countdown = null
            generateGameInfo(gameInfo)
            timer = 10
        } else {
            switchUser(roomID)
            timer = 10
            socketIO.to(roomID).emit('gameInfo update',info)
        }
    })
    socket.adapter.on("join-room", (roomID, id) => {
        console.log(`socket ${id} has joined room ${roomID}`);
        const info = getGameInfo(roomID)
        if (matchingUsers.length === 2) {
            socketIO.to(roomID).emit('start game',info)
            matchingUsers = []
            if (countdown === null) {
                console.log('set countdown')
                countdown = setInterval(()=>{
                    socketIO.to(roomID).emit('counter', timer)
                    timer--
                    if (timer === -1) {
                        switchUser()
                        timer = 10
                        socketIO.to(roomID).emit('gameInfo update',info)
                    }
                }, 1000)
            }
        }
    })
    socket.adapter.on('leave-room',(room,id) => {
        console.log(`socket ${id} has left room ${room}`)
    })
    socket.on('force disconnect',()=>{
        socket.disconnect()
    })
    socket.on('disconnect', ()=>{
        const leftUser = activeUsers.find((user)=>user.id===socket.id)
        if (leftUser !== undefined) console.log(leftUser.name+ ' has left the chat')
        activeUsers = activeUsers.filter((user)=>{
            return (user.id !== socket.id)
        })
        socketIO.emit('active user update', activeUsers)
    })
})
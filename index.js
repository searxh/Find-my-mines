require('dotenv').config()
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

const generateGameInfo = () => {
    return {
        users:[],
        playingUser:chooseRandomUser(),
        scores:[0,0],
        minesArray:createMinesArray(),
    }
}

let chatHistory = []
let activeUsers = []
let matchingUsers = []
let roomCounter = 0
let roomName = "room"+roomCounter
let countdown = null
let timer = 10
let gameInfo = generateGameInfo()

const switchUser = () => {
    const newPlayingUser = Number(!Boolean(gameInfo.playingUser))
    gameInfo.playingUser = newPlayingUser
}

const resetGame = () => {
    gameInfo = generateGameInfo()
}

const checkEndGame = () => {
    return gameInfo.scores[0]+gameInfo.scores[1]===1
}

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
        activeUsers = [ ...activeUsers, user ]
    })
    socket.on('matching',(user)=>{
        console.log('Matching request',user,matchingUsers)
        matchingUsers = [ ...matchingUsers, user ]
        if (gameInfo.users.length < 2) {
            gameInfo.users = matchingUsers
            if (gameInfo.users.find((tempUser)=>tempUser.name===user.name)!==undefined) {
                socket.join(roomName)
            }
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
            chatHistory = [ ...chatHistory, { 
                from:activeUsers[userIndex].name, 
                message:msg, 
                at:Date.now()
            }]
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
    socket.on('select block', (index)=>{
        gameInfo.minesArray[index].selected = true
        if (gameInfo.minesArray[index].value === 1) {
            gameInfo.scores[gameInfo.playingUser]++
        }
        if (checkEndGame()) {
            socketIO.to(roomName).emit('end game',gameInfo)
            clearInterval(countdown)
            countdown = null
            roomCounter++
            roomName = "room"+roomCounter
            resetGame()
        } else {
            switchUser()
            timer = 10
            socketIO.to(roomName).emit('gameInfo update',gameInfo)
        }
    })
    socket.adapter.on("join-room", (room, id) => {
        console.log(`socket ${id} has joined room ${room}`);
        if (matchingUsers.length === 2) {
            socketIO.to(roomName).emit('start game',gameInfo)
            matchingUsers = []
            if (countdown === null) {
                console.log('set countdown')
                countdown = setInterval(()=>{
                    socketIO.to(roomName).emit('counter', timer)
                    timer--
                    if (timer === -1) {
                        switchUser()
                        timer = 10
                        socketIO.to(roomName).emit('gameInfo update',gameInfo)
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
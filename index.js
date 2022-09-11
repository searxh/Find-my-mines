require('dotenv').config()
const app = require('express')()
const http = require('http').Server(app)
const socketIO = require('socket.io')(http,{
    cors: {
      origin: "http://"+process.env.IP+":3000",
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
    const random = Math.random()
    return random>0.5?Math.floor(random):Math.ceil(random)
}

let chatHistory = []
let activeUser = []
let countdown = null
let gameInfo = {
    timer:10,
    users:activeUser,
    playingUser:chooseRandomUser(),
    scores:[0,0],
    minesArray:createMinesArray(),
}

const switchUser = () => {
    const newPlayingUser = Number(!Boolean(gameInfo.playingUser))
    gameInfo.playingUser = newPlayingUser
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
        activeUser = [ ...activeUser, user ]
        gameInfo.users = activeUser
        if (activeUser.length === 2) {
            socketIO.emit('start game',gameInfo)
            countdown = setInterval(()=>{
                socketIO.emit('counter', gameInfo.timer)
                gameInfo.timer--
                if (gameInfo.timer === -1) {
                    switchUser()
                    gameInfo.timer = 10
                    socketIO.emit('gameInfo update',gameInfo)
                }
            }, 1000);
        }
    })
    socket.on('chat message', ({ msg, name, id })=>{
        const userIndex = activeUser.findIndex((user)=>user.name===name)
        activeUser[userIndex].id = id
        if (userIndex !== undefined) {
            chatHistory = [ ...chatHistory, { 
                from:activeUser[userIndex].name, message:msg, at:Date.now()
            }]
            socketIO.emit('chat update', chatHistory)
        }
    })
    socket.on('active user request', ()=>{
        socketIO.emit('active user update', activeUser)
        console.log(activeUser.length+' users are registered')
    })
    socket.on('chat request', ()=>{
        socketIO.emit('chat update', chatHistory)
    })
    socket.on('select block', (index)=>{
        gameInfo.minesArray[index].selected = true
        if (gameInfo.minesArray[index].value === 1) {
            gameInfo.scores[gameInfo.playingUser]++
        }
        switchUser()
        gameInfo.timer = 10
        socketIO.emit('gameInfo update',gameInfo)
    })
    socket.on('disconnect', ()=>{
        const leftUser = activeUser.find((user)=>user.id===socket.id)
        if (leftUser !== undefined) console.log(leftUser.name+ ' has left the chat')
        activeUser = activeUser.filter((user)=>{
            return (user.id !== socket.id)
        })
        socketIO.emit('active user update', activeUser)
    })
})

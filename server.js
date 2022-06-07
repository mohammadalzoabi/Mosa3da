const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const formatMessage = require('./util/messages')
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./util/users')
const moment = require('moment')
const MessagesSchema = require('./models/Messages')

const errorController = require('./controllers/error');



const app = express()
const server = http.createServer(app)
const io = socketio(server)

//Passport Config
require('./config/passport')(passport)

//DB Config
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected!'))
    .catch(err =>  console.log(err));

//EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', 'views');


//BodyParser
app.use(express.json())
app.use(express.urlencoded({extended: false}))


//Express Session
app.use(session({
    secret: 'mosa3da', resave: true, saveUninitialized: true
}))


//Passport Middleware
app.use(passport.initialize())
app.use(passport.session())




//Folders configs
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/cvs', express.static(path.join(__dirname, './cvs')));
app.use(express.static(path.join(__dirname, 'views')));


//Connect Flash
app.use(flash())


// VARS
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.err_msg = req.flash('err_msg')
    res.locals.error = req.flash('error')
    res.locals.isAuthenticated = req.isAuthenticated()
    next()
})
app.locals.moment = require('moment');


//Routes
app.use('/', require('./routes/index'))
app.use('/', require('./routes/users'))
app.use('/', require('./routes/book'))
app.use('/', require('./routes/admin'))

app.use(errorController.get404);



io.on('connection', socket => {
    socket.on('joinRoom', ({patient, room}) => {
        const user = userJoin(socket.id, patient, room)
        socket.join(user.room)

        // Load old Messages
        MessagesSchema.findOne({roomId: room})
            .then(room1 => {
                if(room1) {
                    if(room1.messages.message.length > 0) {
                        for(let i = 0; i<room1.messages.message.length; i++) {
                            socket.emit('message', {username: room1.messages.message[i].sender, text:room1.messages.message[i].message, time:room1.messages.message[i].time})
                        }
                    }
                }
            })

        // Welcome User
        socket.emit('message', formatMessage('Mosa3da Bot', 'Welcome to Mosa3da Messages!'))

        // Broadcast when a User connects
        socket.broadcast.to(user.room).emit('message', formatMessage('Mosa3da Bot', `${user.username} Joined!`))

        //Room and Users info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })

        //Typing Status
        socket.on("typing", (name) => {
            socket.broadcast.to(user.room).emit("typing", name)
        })
    })

    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(`${user.username}` ,msg ))

        // Create new Room in database if it doesn't exist
        MessagesSchema.findOne({roomId: user.room})
            .then(room1 => {
                if(!room1) {
                    const newRoom = new MessagesSchema({
                        roomId: user.room
                    })
                    const newMessage = [...newRoom.messages.message]
                    newMessage.push({sender: user.username, message: msg, time: moment().format('h:mm a')})
                    const updatedMessage = {message: newMessage};
                    newRoom.messages = updatedMessage

                    newRoom
                        .save()
                        .then(result => {
                            console.log("Room Created.");
                        })
                    
                    
                } else if(room1) {
                    const newMessage = [...room1.messages.message]
                    newMessage.push({sender: user.username, message: msg, time: moment().format('h:mm a')})
                    const updatedMessage = {message: newMessage};
                    room1.messages = updatedMessage

                    room1
                        .save()
                        .then(result => {
                            console.log("Room Created.");
                        })
                }
            })
    })

    socket.on('disconnect', () => {
        const user = userLeave(socket.id)

        if(user){
            io.to(user.room).emit('message', formatMessage('Mosa3da Bot', `${user.username} Left!`))

            //Room and Users info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })



    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.broadcast.to(roomId).emit('user-connected', userId)

        socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-disconnected', userId)
        })
    })
})


const PORT = process.env.PORT
server.listen(PORT, console.log('Connected!'))
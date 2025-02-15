//const express = require('express');
const dotenv=require('dotenv');
const connectDB=require('./app/config/db');
const session=require('express-session');
const bodyParser=require('body-parser');
const ejs=require('ejs');
const express=require('express');
const app=require('express')()
const http=require('http').Server(app)
const io=require('socket.io')(http)


dotenv.config();
//const app = express();
connectDB()

//setup session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

app.set('view engine', 'ejs');
app.set('views', 'views');



app.use(express.static('public'));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));



const userRouter=require('./app/router/userRoute')
const User=require('./app/model/user');

app.use(userRouter);

/*scoket.io*/


/**define namespace */
var usp=io.of("/user-name")
usp.on('connection', async(socket) => {
    /**connected part */
    console.log('a user connected');
    //console.log('sssss',socket.handshake.auth.token);
    var user_id=socket.handshake.auth.token;
    await User.findByIdAndUpdate(user_id,{$set:{is_online:'1'}})


    /**broadcast user online part */
    socket.broadcast.emit("OnlineUser", { user_id: user_id });
    
    /**disconnected part */
    socket.on('disconnect', async() => {
        console.log('user disconnected');

        var user_id=socket.handshake.auth.token;
        await User.findByIdAndUpdate(user_id,{$set:{is_online:'0'}})
        /**broadcast user offonline part */
        socket.broadcast.emit("OfflineUser", { user_id: user_id });
      });

  });

const port = 3006
http.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
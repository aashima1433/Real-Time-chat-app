const { Socket } = require('dgram');
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);

let users = {
    'aashima' : 'qwerty'
}
let socketMap ={};


io.on('connection',(socket)=>{
    console.log('connected with socket id = ', socket.id)

    socket.on('login',(data)=>{
        if(users[data.username])
        {
            if(users[data.username]==data.password)
            {
                socket.join(data.username)
                socket.emit('logged_in')
                socketMap[socket.id]= data.username
            }
            else{
                socket.emit('login_failed')
            }

        }
        else{
            users[data.username] = data.password
            socket.join(data.username)
            socket.emit('logged_in')
            socketMap[socket.id]= data.username
            
        }
        console.log(users)
        console.log(socketMap);
    })

    socket.on('msg_send',(data)=>{
        data.from = socketMap[socket.id]
        if(data.to)
        {
          io.to(data.to).emit('msg_rcvd',data)
        }
        else
        {
           socket.broadcast.emit('msg_rcvd',data)
        }
    })


})
app.use('/',express.static(__dirname + '/public'));
server.listen(3344,()=>{
    console.log('Server started on http://localhost:3344');
})
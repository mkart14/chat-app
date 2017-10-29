console.log('Starting app.js');

const path=require('path')
const http=require('http')
const express=require('express')
const socketIO = require('socket.io')

const {generateMessage}=require('./utils/message.js');
const publicPath=path.join(__dirname,'../public')
var app=express();
var server=http.createServer(app);
var io= socketIO(server);
const port=process.env.PORT||3000;

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
  console.log('New user connected');

  socket.emit('newMessage',generateMessage('Admin','Welcome to chat room'));

  socket.broadcast.emit('newMessage',generateMessage('Admin','New user joined'));

  socket.on('createMessage',(message,callback)=>{
    console.log(`createMessage`, message);
    io.emit('newMessage',generateMessage(message.from,message.text));
    callback('This is from server');
    // socket.broadcast.emit('newMessage',{
    //   from:message.from,
    //   text:message.text,
    //   createdAt:new Date().getTime()
    // });
  });

  socket.on('disconnect',()=>{
    console.log('Disconnected from server');
  });
});

server.listen(port,()=>{
  console.log(`Server started on port ${port}`);
});

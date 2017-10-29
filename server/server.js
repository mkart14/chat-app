console.log('Starting app.js');

const path=require('path')
const http=require('http')
const express=require('express')
const socketIO = require('socket.io')

const publicPath=path.join(__dirname,'../public')
var app=express();
var server=http.createServer(app);
var io= socketIO(server);
const port=process.env.PORT||3000;

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
  console.log('New user connected');

  socket.emit('newMessage',{
    from:'peeyush@example.com',
    text:'Hey Bro',
    createdAt:new Date().getTime()
  });


  socket.on('createMessage',(message)=>{
    console.log(`createMessage`, message);
  });

  socket.on('disconnect',()=>{
    console.log('Disconnected from server');
  });
});

server.listen(port,()=>{
  console.log(`Server started on port ${port}`);
});

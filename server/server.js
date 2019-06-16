console.log('Starting app.js');

const path=require('path')
const http=require('http')
const express=require('express')
const socketIO = require('socket.io')

const {Users} = require('./utils/users');
const{isRealString} = require('./utils/checkValid.js');
const {generateMessage,generateLocationMessage}=require('./utils/message.js');
const publicPath=path.join(__dirname,'../public')
var app=express();
var users=new Users();
var server=http.createServer(app);
var io= socketIO(server);
const port=process.env.PORT||4000;

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
  console.log('New user connected');

  // socket.emit('newMessage',generateMessage('Admin','Welcome to chat room'));
  //
  // socket.broadcast.emit('newMessage',generateMessage('Admin','New user joined'));

  socket.on('join',(params,callback)=>{
    if(!isRealString(params.name) || !isRealString(params.room)){
      callback('Name and Room required');
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id,params.name,params.room);
    io.to(params.room).emit('updateUserList',users.getUserList(params.room));
    socket.emit('newMessage',generateMessage('Admin','Welcome to chat room'));
    socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} joined`));

    callback();
  });

  socket.on('createMessage',(message,callback)=>{
    console.log(`createMessage`, message);
    var user= users.getUser(socket.id);
    if(user &&isRealString(message.text)){
    io.to(user.room).emit('newMessage',generateMessage(user.name,message.text));
  }
    callback('This is from server');
    // socket.broadcast.emit('newMessage',{
    //   from:message.from,
    //   text:message.text,
    //   createdAt:new Date().getTime()
    // });
  });

  socket.on('createLocationMessage',(coords)=>{
    var user= users.getUser(socket.id);
    io.to(user.room).emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude,coords.longitude,user.name));
  });

  socket.on('disconnect',()=>{
    var user= users.removeUser(socket.id);
    if(user){
      io.to(user.room).emit('updateUserList',users.getUserList(user.room));
      io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left`));
    }
    console.log('Disconnected from server');
  });
});

server.listen(port,()=>{
  console.log(`Server started on port ${port}`);
});

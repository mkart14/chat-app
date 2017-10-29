var socket = io();

socket.on('connect',function(){
  console.log('Connected to server');

  socket.emit('createMessage',{
    to:'bla@bula.com',
    text:'Heyaaaa'
  });
});
socket.on('disconnect',function(){
  console.log('User was disconnected');
});
socket.on('newMessage',function(message){
  console.log('New Message',message);
});

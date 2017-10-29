var socket = io();

socket.on('connect',function(){
  console.log('Connected to server');
});
socket.on('disconnect',function(){
  console.log('User was disconnected');
});
socket.on('newMessage',function(message){
  var time = moment(message.createdAt).format('h:mm a')
  console.log('New Message',message);
  var li =jQuery('<li></li>');
  li.text(`${message.from} ${time}:${message.text}`);
  jQuery('#messages').append(li);
});

socket.on('newLocationMessage',function(message){
  var time = moment(message.createdAt).format('h:mm a')
  console.log('New Location Message',message);
  var li =jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My Current Location</a>');
  a.attr('href',message.url);
  li.text(`${message.from} ${time}:`);
  li.append(a);
  jQuery('#messages').append(li);
});

var messageTextBox = jQuery('[name=message]');

jQuery('#message-form').on('submit',function(e){
  e.preventDefault();
  socket.emit('createMessage',{
    from:'User',
    text:messageTextBox.val()
  },function(){
messageTextBox.val('')
  });
});
var locationButton = jQuery('#send-location')
locationButton.on('click',function(){
  if(!navigator.geolocation){
    return alert('Geolocation not supported by browser');
  }
  $("#send-location").prop("disabled",true);
  $("#send-location").html("Sending...");
  navigator.geolocation.getCurrentPosition(function(position){
    $("#send-location").prop("disabled",false);
    $("#send-location").html("Send Location");
    socket.emit('createLocationMessage',{
      latitude:position.coords.latitude,
      longitude:position.coords.longitude
    })
  },function(){
    alert('Unable to fetch location')
    $("#send-location").html("Send Location");
    $("#send-location").prop("disabled",false);
  });
});

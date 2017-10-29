var socket = io();

function autoScroll(){
var messages = jQuery('#messages');
var ch=messages.prop('clientHeight');
var sT=messages.prop('scrollTop');
var sH=messages.prop('scrollHeight');
var newMessage = messages.children('li:last-child');
var newMessageHeight = newMessage.innerHeight();
var lastMessageHeight = newMessage.prev().innerHeight();
if((ch+sT+newMessageHeight+lastMessageHeight)>=sH){
messages.scrollTop(sH);
}
}

socket.on('connect',function(){
  console.log('Connected to server');
  var params = jQuery.deparam(window.location.search);
  socket.emit('join',params,function(err){
    if(err){
      alert(err);
      window.location.href='/';
      console.log(err);
    }
    else{
      console.log('Awesome');
    }
  });
});
socket.on('disconnect',function(){
  console.log('User was disconnected');
});

socket.on('updateUserList',function(users){
  var ol =jQuery('<ol></ol>');

  users.forEach(function(user){
    ol.append(jQuery('<li></li>').text(user));
  });
  jQuery('#users').html(ol);
  console.log('Users list',users);
});

socket.on('newMessage',function(message){
  var time = moment(message.createdAt).format('h:mm a')
  var template= jQuery('#message-template').html();
  var html=Mustache.render(template,{
    text:message.text,
    from:message.from,
    createdAt:time
  });
  console.log('New Message',message);
  // var li =jQuery('<li></li>');
  // li.text(`${message.from} ${time}:${message.text}`);
  jQuery('#messages').append(html);
  autoScroll();
});

socket.on('newLocationMessage',function(message){
  var time = moment(message.createdAt).format('h:mm a')
  var template= jQuery('#location-message-template').html();
  var html=Mustache.render(template,{
    text:message.text,
    from:message.from,
    url:message.url,
    name:message.name,
    createdAt:time
  });
  console.log('New location message');
  // console.log('New Location Message',message);
  // var li =jQuery('<li></li>');
  // var a = jQuery('<a target="_blank">My Current Location</a>');
  // a.attr('href',message.url);
  // li.text(`${message.from} ${time}:`);
  // li.append(a);
  jQuery('#messages').append(html);
  autoScroll();
});

var messageTextBox = jQuery('[name=message]');

jQuery('#message-form').on('submit',function(e){
  e.preventDefault();
  socket.emit('createMessage',{
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

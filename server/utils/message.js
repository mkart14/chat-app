var moment = require('moment');

var generateMessage =(from,text)=>{
  return {
    from,
    text,
    createdAt:moment().valueOf()
  };
};

var generateLocationMessage =(from,lat,long)=>{

  return {
    from,
    url:`https://www.google.com/maps?q=${lat},${long}`,
    urlImg:"https://maps.googleapis.com/maps/api/staticmap?center=" + lat + "," + long + "&zoom=13&size=300x300&sensor=false",
    createdAt:moment().valueOf()
  };
};

module.exports={generateMessage,generateLocationMessage};

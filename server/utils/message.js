var moment = require('moment');

var generateMessage =(from,text)=>{
  return {
    from,
    text,
    createdAt:moment().valueOf()
  };
};

var generateLocationMessage =(from,lat,long,name)=>{

  return {
    from,
    url:`https://www.google.com/maps?q=${lat},${long}`,
    createdAt:moment().valueOf(),
    name
  };
};

module.exports={generateMessage,generateLocationMessage};

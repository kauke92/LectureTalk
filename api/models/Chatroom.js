/**
* Chatroom.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  //different to the type in lecturestream
    start_time:{
      type:'datetime',
      required: true
    },

    //different to the type in lecturestream
    end_time:{
      type:'datetime',
      required: true
    },

    active:{
      type:'boolean',
      defaultsTo: false
    },

    archive:{
      type:'boolean',
      defaultsTo: false
    },

    lecture_stream: {
    model: 'lecturestream',
    required: false

    },

    messages: {
      collection:'Message',
      via: 'chatroom'
    },

    students: {
      collection: 'student',
      dominant: true,
      via: 'chatroom'
    }
  }
};


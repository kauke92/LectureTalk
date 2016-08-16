/**
* Message.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	content: {
  		type: 'string',
  		required: true
  	},

  	date: {
  		type: 'datetime',
  		required: false
  	},

  	rating: {
  		collection: 'Student',
  		required: false
  	},

  	chatroom: {
  	 	model: 'Chatroom',
  		required: true
  	},

  	author: {
  	 	model: 'Student',
  	 	required: true
  	 },

  	 replies: {
  	 	collection: 'Message',
      required: false

  	 }

  }
};


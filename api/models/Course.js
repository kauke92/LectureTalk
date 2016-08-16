/**
* Course.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	unit_code: {
  		type: 'string',
  		required: true
  	},

  	name: {
  		type: 'string',
  		required: true
  	},

  	credit_points: {
  		type: 'int',
  		required: true
  	},

  	students: {
  		collection:'student',
  		via: 'courses'
  	},

    lecturestreams: {
      collection:'Lecturestream',
      via: 'course'
    },

    start_date : {
      type: 'datetime',
      required :true
    }
  
  },

  beforeCreate: function(attrs, next) {
      //console.log(attrs.day[0]);  
      Course.findOne({unit_code: attrs.unit_code}, function(err, course){
          if (err) return next(err);
          if (course) {
              return next({err: "This unit code is already available"});
          } else {
              if (attrs.unit_code.length!=8){
                return next({err: "The unit code is not valid."});
              }
              for (i=0;i<4;i++) {
                  if ((attrs.unit_code.charAt(i)<'A') || (attrs.unit_code.charAt(i)>'Z')) {
                      return next({err: "The unit code is not valid"});
                  }
              }
              for (i=0;i<4;i++) {
                  if ((attrs.unit_code.charAt(4+i)<'0') || (attrs.unit_code.charAt(4+i)>'9')) {
                      return next({err: "The unit code is not valid"});
                  }
              }
              
              next();
          } 
      });
  },

  afterCreate: function(attrs, next) {
  
          Course.findOne({unit_code: attrs.unit_code},function(err, acourse) {
            for (i=0;i<attrs.day.length;i++) {
              var newObj = {
                      day : attrs.day[i],
                      start_time : attrs.start[i],
                      end_time: attrs.end[i],
                      course : acourse.id
              }
              Lecturestream.create(newObj, function(err, lecturestream) {
              });
            }
          
          });
    next();
  }
};


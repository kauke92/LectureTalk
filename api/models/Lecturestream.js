/**
* LectureStream.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    //range: 0-6 where 0 represents Monday and 6 represents Sunday
    day: {
      type: 'int',
      required: true
    },

    //range: 0000 - 2359 where 1400 represents 2pm 
    start_time: {
      type: 'int',
      required: true
    },

    //range: 0000 - 2359 where 1400 represents 2pm
    end_time: {
      type: 'int',
      required: true
    },

    course: {
      model: 'Course'
    },

    chatrooms: {
      collection:'Chatroom',
      via: 'lecture_stream'
    },
  },

  afterCreate: function(attrs, next) {
   //console.log(attrs);
    Lecturestream.findOne({id: attrs.id}).populate('course').exec(function(err, r) {
     //   console.log('got this course ' + r.toJSON());
        // Course.findOne({id: r.course.id}).exec(function(err, course) {
        //      // console.log(course);
        //       course.lecturestreams.push(r.id);
        //      // console.log('after adding LT to course ' + course.toJSON());
        //       course.save(function(err,newcourse){
        //           if (err) console.log('err');
        //           Course.update({id: r.course.id}, newcourse).exec(function(err, updatedCourse) {
        //              // console.log('after updateLT to course ' + updatedCourse.toJSON());
        //           });
        //       });
        // });
        var newtime = new Date( JSON.parse(JSON.stringify(r.course.start_date)));
        newtime.setDate(newtime.getDate()+Number(r.day)-7);   
        for (j=0; j<13;j++) {
            newtime.setDate(Number(newtime.getDate()) + 7);
            newtime.setHours(Number(attrs.start_time/100));
            newtime.setMinutes(Number(attrs.start_time % 100));
            var another = new Date( JSON.parse(JSON.stringify(newtime)));
            another.setHours(Number(attrs.end_time/100));
            another.setMinutes(Number(attrs.end_time % 100));
            var arch = false;
            var act = false;
            if (Date.parse(another) < Date.parse(new Date())) {
              arch = true;
            }
            if (Date.parse(new Date()) > Date.parse(newtime) && Date.parse(new Date()) < Date.parse(another)){
              act = true;
              arch = false;
            }
            var newObj ={
                start_time : newtime,
                end_time: another,
                lecture_stream : attrs.id,
                archive: arch,
                active: act
            }


            function updateAll(){
               Chatroom.find().exec(function foundChatroom(err, allChatrooms){
                  if (err) return next(err);
                  if (!allChatrooms) return next();
                for (var i = 0; i < allChatrooms.length; i++){

                  var currentTime = new Date();
                  var start_time = new Date(allChatrooms[i].start_time);
                  var end_time = new Date(allChatrooms[i].end_time);

                  if (currentTime > start_time && currentTime < end_time){
                    Chatroom.update({id:allChatrooms[i].id}, {active:true, archive:false}).exec(function(){});
                  }else if (currentTime < start_time){
                    Chatroom.update({id:allChatrooms[i].id}, {active:false, archive:false}).exec(function(){});
                  }else if (currentTime > end_time){
                    Chatroom.update({id:allChatrooms[i].id}, {active:false, archive:true}).exec(function(){});
                  }
                }
              });
            }

            Chatroom.create(newObj, function(err, chatroom){
              var CronJob = require('cron').CronJob;
              var start_time = new Date(chatroom.start_time);
              var end_time = new Date(chatroom.end_time);
              new CronJob(start_time, function(){
                updateAll();
              }, null, true, "");
              new CronJob(end_time, function(){
                updateAll();
              }, null, true, "");
            });
        }
    });
    next();
  }
};


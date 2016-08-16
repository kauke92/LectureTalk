/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  //require('express-helpers')(sails.express.app);
  sails.on('lifted', function() {
     // Your post-lift startup code here
     Chatroom.find().exec(function foundChatroom(err, allChatrooms){
     	if (err) return next(err);
		if (!allChatrooms) return next();
		var CronJob = require('cron').CronJob;

		function updateAll(){
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
		}

		updateAll();

		for (var i = 0; i < allChatrooms.length; i++){
			var start_time = new Date(allChatrooms[i].start_time);
			var end_time = new Date(allChatrooms[i].end_time);

			if (!allChatrooms[i].archive){
				if (!allChatrooms[i].active){
					new CronJob(start_time, function(){
						updateAll();
					}, null, true, "");
					new CronJob(end_time, function(){
						updateAll();
					}, null, true, "");
				}else{
					new CronJob(end_time, function(){
						updateAll();
					}, null, true, "");
				}
			}
		}
     });
  });
  cb();
};

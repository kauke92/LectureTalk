/**
 * ChatroomController
 *
 * @description :: Server-side logic for managing chatrooms
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

 function compare(a,b) {
   if (a.rating < b.rating)
      return -1;
   if (a.rating > b.rating)
     return 1;
   return 0;
 }

 function getFirstNames(err, student) {
 	if(err) return err;


 }

module.exports = {
	
	show : function(req, res, next) {
		var messages =[];
		var save;
		Chatroom.find({id:req.param('id')}).populateAll().exec(function foundChatroom(err, chatroom){
			if (err) return next(err);
			if (!chatroom) return next();
			var i= -1;
			function series() {
				if (i==-1) {
					//console.log('find '+ chatroom[0].lecture_stream.course);
					Course.findOne({id:chatroom[0].lecture_stream.course}).exec(function foundA(err, acourse){
						//if (err) console.log('errrr');
						//if (!acourse) console.log('not found course');
						save = acourse;
						i++;
						//console.log('course: '+acourse.id);
						return series();
					});
					
					//sconsole.log(save);
					
				} else {
					if (chatroom[0].messages.length>0) {
						Message.findOne({id : chatroom[0].messages[i].id}).populate('author').exec(function(err, amessage){
							messages.push(amessage);
							i++;
							if (i<chatroom[0].messages.length) return series()
							else {
								res.view({
									chatroom: chatroom[0],
									messages : messages,
									course: save
								});
							}
						});
					} else {
						
						res.view({
									chatroom: chatroom[0],
									messages : messages,
									course: save
						});

					}
				}
			}
			series();
			
		});
		
	},

	view: function(req, res, next) {
		if (req.isSocket) {
			//subscribe mayhaps?
		}
		var id = req.query.id;
		Chatroom.find({id: id}).populateAll()
			.exec(function chatroom(err, chatroom) {
				if(err) {
					return next(err);
				}
				var chatroom = chatroom[0];
				var students = chatroom.students;
				var messages = chatroom.messages;
				// function studentNames(i) {
				// 	if(i<students.length) {
				// 		Students.find({id:students[i].id}).populateAll()
				// 		.exec(getFirstNames(err, student));
				// 		studentNames(i+1);
				// 	}
				// }
				function msgSeries(i) {
					if(i<messages.length) {
						//do things;
						Message.find({id:messages[i].id}).populateAll()
							.exec(function msgDetails(err, msg) {
								if(err) {
									return console.log(err);
								}
								messages[i].author = msg[0].author.first_name;
								messages[i].rating = msg[0].rating.length;
								msgSeries(++i);
							});
						
					}
					else {
						console.log("lecture stream: "+chatroom.lecture_stream.course);
						Course.find({id:chatroom.lecture_stream.course})
							.exec(function courseCB(err, course) {
								sortedMessages = messages.concat().sort(compare).reverse()

								res.view('chatroom.ejs',
									{chatroom:chatroom,
										messages: messages,
										course:course[0].unit_code,
										students: students,
										sortedMessages: sortedMessages.splice(0, 5)});
							});
						
					}
				}
				msgSeries(0);
			});
		
	},


	connect: function(req, res, next) {
		//connect student to chatroom on request.

		var student = req.session.Student;
		var id = req.query.id;
		if (!student) {
			return next("Not authenticated");
		}
		console.log('looking for chatroom with id: '+id);
		Chatroom.find({id: id})
			.populate('students').exec(function cr(err, cr) {
				//TODO check if student is enrolled
				if(err) {
					return next(err);
				}
				Chatroom.subscribe(req, cr[0].id, ['message']);
				console.log("adding student to chatroom")
				cr[0].students.add(student);
				cr[0].save(function connected(err, resp) {
					console.log("saving change")
					if(err) return next(err);
					console.log("notifying chatroom of new student")
					Student.find({id:student.id}, function name(err, name) {
						Chatroom.message(id, {type: 'join', student:name[0].first_name});
						console.log("all okkkkk");
						//return next();
					});

				});
			});
	},

	disconnect: function(req, res, next) {
		console.log("disconnecting from chatroom");
		var student = req.session.Student;
		chatroom = student.chatroom;
		Student.update({id: student.id}, {chatroom: null}).exec(function dc(err, student) {
			if(err) {
				return next(err);
			}
			Chatroom.message(chatroom, {type: 'leave', student:student.first_name});
		});
		//remove student in session from chatroom.
	},

	start : function(req,res, next) {
		Chatroom.update(req.param('id'), {active: true}).exec(function chatroomStart(err, chatroom){
			if (err) console.log('start chatroom error');
			if (!chatroom) console.log('chatroom not found');
			next();
		});
	},
	close : function(req,res, next) {
		Chatroom.update(req.param('id'), {active: false, archived: true}).exec(function chatroomStart(err, chatroom){
			if (err) console.log('close chatroom error');
			if (!chatroom) console.log('chatroom not found');
			next();
		});
	}
};


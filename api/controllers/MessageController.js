/**
 * MessageController
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
/** TODO message likes and ratings. **/
	create: function(req, res, next) {
		var chatroomID = req.body.croomid;
		var message = req.body.content
		replySplit = message.split(" ")
		var reply = false
		if(replySplit.length>1 && replySplit[0][0]==="@") {
			reply = true
		}
		Chatroom.findOne({id: chatroomID}).populateAll()
			.exec(function croomCB(err, chatRoom) {
				if(!chatRoom.active) {
					Chatroom.message(chatroomID, {type:"alert",
						message:"Sorry, this chatroom is not accepting messages."}, req.socket);
					return next("This chatroom has been archived");
					//console.log("This has been archived yo yo yo");
				}
				Message.create({
					content: message,
					date: new Date(),
					rating: 0,
					chatroom: chatroomID,
					author: req.session.Student
				}).populateAll().exec(function createdMsg(err, msg) {
					if(err) return next(err);
					console.log("Message successfuly created!");
					console.log("message: "+msg);
					var student = req.session.Student.first_name;
					//msg.author = student;
					//publish it, change attrs so it's easier client-side.
					if(reply) {
						var replyID = replySplit[0].substring(1);
						console.log(replyID);
						Message.find({id:replyID}).populateAll().
						exec(function parentCB(err, parent){
							if(err) return next(err);
							parent[0].replies.add(msg);
							parent[0].save(function replySaved(err, r) {
								Chatroom.message(chatroomID, {type:"reply",
								message:msg.content, author:req.session.Student.first_name, replyee: r.author}, req.socket)
							});
						});
					}
					Message.publishCreate(msg, req.socket);
					Chatroom.message(chatroomID,
						{chatroom:chatroomID, content:msg.content,
							author:student, id:msg.id, type:'message'}, req.socket);
					res.send({});
				})

			})

	},

	like: function(req, res) {
		var msgID = req.body.id;
		var userID = req.session.Student;
		console.log("ID: "+msgID);

		Message.find({id: msgID}).populate('rating').exec(function(err, msgs) {
			msgs[0].rating.add(userID);
			msgs[0].save(function saved(err, resp) {
				if(err) {
					//if exists, or something goes wrong, just send back original
					//side thought. If exists, remove the like? revisit if time permits.
					console.log(err);
					res.send({'id': msgID, 'rating': msgs[0].rating});
					return;
				}
				console.log("------ PRINTING MSG RESPONSE ------")
				console.log(resp);
				Message.publishUpdate(resp.id, resp.rating, req.socket);
				Chatroom.message(resp.chatroom, {chatroom:resp.chatroom,
				type:"rating", rating: resp.rating, id:resp.id, author:resp.author}, req.socket);
				res.send({});
			})
		});

	}
	
};


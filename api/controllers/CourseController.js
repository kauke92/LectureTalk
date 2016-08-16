/**
 * UserController
 *
 * @description :: Server-side logic for managing unit of study
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
module.exports = {
	'new' : function(req,res ) {
		//Chatroom.findOne({id: 163}).populate('lecture_stream').exec(function (err,r) {Lecturestream.findOne({id:r.lecture_stream.id}).populate('course').exec(console.log)});
		//Chatroom.findOne({id: 163}).populate('lecture_stream').exec(function (err,r) {console.log(r)});

		res.view();
	},

	exceededcp : function(req, res) {
		res.view();
	},

	duplicate_course : function(req, res) {
		res.view();
	},

	create : function(req,res) {
		
		var days =[];
		if (Number(req.param('day1'))>=0) days.push(Number(req.param('day1')));
		if (Number(req.param('day2'))>=0) days.push(Number(req.param('day2')));
		if (Number(req.param('day3'))>=0) days.push(Number(req.param('day3')));



		var starts =[];
		if (Number(req.param('start_time1'))>=0) starts.push(Number(req.param('start_time1')));
		if (Number(req.param('start_time2'))>=0) starts.push(Number(req.param('start_time2')));
		if (Number(req.param('start_time3'))>=0) starts.push(Number(req.param('start_time3')));
		var ends =[];
		if (Number(req.param('end_time1'))>0) ends.push(Number(req.param('end_time1')));
		if (Number(req.param('end_time2'))>0) ends.push(Number(req.param('end_time2')));
		if (Number(req.param('end_time3'))>0) ends.push(Number(req.param('end_time3')));

		var newObj = {
			unit_code : req.param('unit_code'),
			name : req.param('name'),
			credit_points : req.param('credit_points'),
			start_date	 : new Date(Number(req.param('year')),Number(req.param('month'))-1,Number(req.param('date'))),
			day: days,
			start: starts,
			end: ends
		}
		Course.create(newObj,function(err, course) {
			if (err) {
		 		req.session.flash = {
		 			err : err
		 		}
		 	res.locals.flash = _.clone(req.session.flash);

		 	return res.redirect('/course/new');
		 	}
		});
		res.redirect('/student/admin/');
	},
	show : function(req, res, next) {
		var sort_by = function(field, reverse, primer){

		   var key = primer ? 
		       function(x) {return primer(x[field])} : 
		       function(x) {return x[field]};

		   reverse = [-1, 1][+!!reverse];

		   return function (a, b) {
		       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
		     } 
		}		
		var chatrooms=[];
		Course.findOne({unit_code:req.param('id')}).populate('lecturestreams').exec(function doB(err, course){
			//console.log(course.id);
 	 		var j=0;
 	 		function seri2() {
 	 			Lecturestream.findOne({id:course.lecturestreams[j].id}).populate('chatrooms').exec(function doC(err, lecturestream){
 	 				//console.log(lecturestream.id);
 	 				var k=0;
 	 				function seri3() {
 	 					//console.log(lecturestream.chatrooms.length);
 	 					Chatroom.findOne({id: lecturestream.chatrooms[k].id }).exec(function doD(err, chatroom) {
 	 						chatrooms.push(chatroom);
 	 						k++;
 	 						if (k<lecturestream.chatrooms.length) return seri3() 
		  					else {
		  						k=0;
		  						j++;

		  						if (j==course.lecturestreams.length) {

		  							chatrooms.sort(sort_by('start_time', false	, function(a){return Date.parse(a)}));

		  							res.view({
		  								course: course,
		  								chatrooms: chatrooms
		  							})
		  						} else 
		  						return seri2();
		  						//console.log('ere');
		  					}
 	 					}); 
 	 				}
 	 				seri3();
 	 				//console.log('finish 3');
 	 			});
 	 		}
 	 		seri2();
 	 	});
		// Course.findOne({unit_code: req.param('id')}, function foundCourse(err, course) {
		// 	if (err) return next(err);
		// 	if (!course) return next();
		// 	res.view({
		// 		course: course
		// 	});
		// });
	},
	index: function(req,res,next) {
		Course.find(function foundCourses(err, courses) {
			if (err) return next(err);
			res.view({
				courses: courses
			});
		});
		
	},
	edit: function(req, res, next) {
		Course.findOne({unit_code: req.param('id')}, function foundCourse(err, course) {
			if (err) return next(err);
			if (!course) return next();
			res.view({
				course: course
			});
		});
	},
	update: function(req, res, next) {
		// //req.param('start_date') = new Date(Number(req.param('year')),Number(req.param('month'))-1,Number(req.param('date')));

		// //console.log(start_date);
		// if (Number(req.param('year'))>0 && Number(req.param('date'))>0 && Number(req.param('month')>0)) {
		// 	var newObj = {	
		// 		unit_code: req.param('unit_code'),
		// 		name: req.param('name'),
		// 		credit_points: req.param('credit_points'),
		// 		start_date : new Date(Number(req.param('year')),Number(req.param('month'))-1,Number(req.param('date')))

		// 	}
		// }
		// else {
		// 	var newObj = {	
		// 		unit_code: req.param('unit_code'),
		// 		name: req.param('name'),
		// 		credit_points: req.param('credit_points'),
		// 	}
		// }
		// Course.update({unit_code: req.param('id')},newObj).exec(function courseUpdated(err, course) {
		// 	if (err)  {
		// 		return res.redirect('/course/edit/' + req.param('id'));
		// 	}
		// 	res.redirect('/course/show/'+ req.param('unit_code'));
		// })
		next();
	},
	destroy: function(req, res, next) {
		Course.findOne({unit_code: req.param('id')}, function foundCourse(err, course){
			if (err) return next(err);
			if (!course) return next('Course doesn\'t exist.');
			Course.destroy({unit_code: req.param('id')}, function courseDestroyed(err) {
				if (err) return next(err);
			});
			res.redirect('/admin');
		});
	},

	add: function (req, res, next) {
		var id = req.session.Student.id;
		Student.findOne({id: id}).populate('courses').exec(function(err, thisStudent) { 
			Course.findOne({unit_code: req.param('unit_code')}).exec(function(err, thisCourse) {
				var creditPoints = thisCourse.credit_points;

				for (i = 0; i < thisStudent.courses.length; i++) { 
					creditPoints = parseInt(creditPoints) + parseInt(thisStudent.courses[i].credit_points) 
					console.log("in for loop cp is " + creditPoints);

					// check if the course they are trying to add is a duplicate course, this is not allowed
					if (thisStudent.courses[i].unit_code == thisCourse.unit_code) {
						res.redirect('/course/duplicate_course');
					}
				}   
				// check if credit points are over 30, this is not allowed
				if (creditPoints > 30) {
					res.redirect('/course/exceededcp');;
				}

				else {
				console.log("credit points is " + creditPoints);    
					thisStudent.courses.add(thisCourse); 
					thisStudent.save(function(err, newStudent){});
					res.view({
						course: thisCourse
					});
				}
			}); 
		});
	},

	'loggedinhome': function(req,res, next) {
		if (!req.session.authenticated){
			res.redirect('/login');
			return;
		}
		Student.findOne({id: req.session.Student.id}).populate('courses').exec(function foundStudent(err, student){
			if (err) return next(err);
			if (!student) return next();
			var enrolled_courses = []
			var chatrooms_list;

			var i = -1;
			function series(){
				if (i == -1){
					Chatroom.find({sort:'start_time DESC'}).populateAll().exec(function foundChatroom(err, someChatrooms){
						if (err) return next(err);
						if (!someChatrooms) return next();
						chatrooms_list = someChatrooms;
						i++;
						return series()
					});
				}else if (i < student.courses.length){
					//console.log(i)
					Course.findOne({id: student.courses[i].id}).populateAll().exec(function foundCourse(err, aCourse){
						if (err) return next(err);
						if (!aCourse) return next();
						aCourse.lecturestreams = aCourse.lecturestreams.sort({day:1, start_time:1});
						enrolled_courses.push(aCourse);
						i++;
						return series()
					});
				}else{
					if(!req.isSocket){
						res.view({
							courses: enrolled_courses,
							chatrooms: chatrooms_list
						});
				}
				}
			}
			series();
			
		});
		
	},

	delete: function(req, res) {
		var id = req.session.Student.id;
		Student.findOne({id: id}).exec(function(err, thisStudent) { 
			Course.findOne({unit_code: req.param('unit_code')}).exec(function(err, thisCourse) { 
				if (err) {
					res.send(400);
				}

				thisStudent.courses.remove(thisCourse.id); 
				thisStudent.save(function(err,newA){});
			}); 
		});
		res.view();
	},

	delete_validate: function(req, res) {
		var id = req.session.Student.id;
		Student.findOne({id: id}).exec(function(err, thisStudent) { 
			Course.findOne({unit_code: req.param('unit_code')}).exec(function(err, thisCourse) { 
				if (err) {
					res.send(400);
				}
				res.view({
					course: thisCourse
				});
			}); 
		}); 
	},	

	search : function(req, res) {
		var unit_code = req.param('unit_code')
		Course.findOne({unit_code: unit_code}).exec(function (err, course) {
			if (err) {
				res.send(400);
			}
			else {
				res.view({
					course: course
				});				
			}
		});
	},

	manage : function(req,res) {
		if (!req.session.authenticated){
			res.redirect('/login');
			return;
		}
		Student.findOne({id: req.session.Student.id}).populate('courses').exec(function foundStudent(err, student){
			if (err) return next(err);
			if (!student) return next();

			res.view( {
				courses: student.courses
			});
		});
		
	},
};

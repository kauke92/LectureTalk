/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'new': function(req,res) {
		res.view();
	},

	create: function(req, res, next) {
		 Student.create(req.params.all(), function userCreated(err, student) {
		 	if (err) {
		 		req.session.flash = {
		 			err : err
		 		}

		 		res.locals.flash = _.clone(req.session.flash);

		 		return res.redirect('/student/new');
		 	}

		 	req.session.authenticated = true;
		 	req.session.Student = student;
		 	student.online = true;
		 	if(student.email === "dvis5462@uni.sydney.edu.au") {
		 		student.admin = true;
		 	}
		 	student.save(function(err,student)  {
		 		if (err) return next(err);
		 		res.redirect('/student/show/'+student.id);
		 	});
		 	
		 	//req.session.flash = {};
		});
	},
	compare: function(req, res, next) {
		if (req.param('fcode')== req.session.Student.code) {
			Student.update(req.param('id'),{verified: true}).exec(function studentUpdated(err, student) {
			if (err)  {
				return res.redirect('/student/edit/' + req.param('id'));
			}
			res.redirect('/student/show/'+req.param('id'));
			})

		} else {
			
			res.redirect('/validate');
		}
	},

	show : function(req, res, next) {

		Student.findOne(req.param('id'), function foundStudent(err, student) {
			if (err) return next(err);
			//console.log(student);
			if (!student) return next();
			res.view({
				student: student
			});
		});
	},

	index: function(req,res,next) {
		Student.find(function foundStudents(err, students) {
			if (err) return next(err);
			res.view({
				students: students
			});
		});
		
	},	

	admin: function(req,res,next) {
		Student.find(function foundStudents(err, students) {
			if (err) return next(err);
			Course.find().populate('students').exec(function foundcourses(err, courses) {
				if (err) return next(err);
				res.view({
					students: students,
					courses: courses
				});
			});
		
		});
	},


	edit: function(req, res, next) {
		Student.findOne(req.param('id'), function foundStudent(err, student) {

			if (err) return next(err);
			if (!student) return next();
			res.view({
				student:student
			});
		});
	},
	update: function(req, res, next) {
		Student.findOne({email:req.param('email')}, function foundStudent(err, student) {
			if (err)  {
				return res.redirect('/student/edit/' + req.param('id'));
			}
			if (req.param('first_name').length+req.param('last_name').length>30) {
				var LongName = [{message:'The first name or last name is too long.'}]
		 		req.session.flash = {
		  			err : LongName
		  		}

		 		return res.redirect('/student/edit/' + req.param('id'));

			}

			if (req.param('degree').length>30) {
				var LongDegree = [{message:'The degree is too long.'}]
		 		req.session.flash = {
		  			err : LongDegree
		  		}

		 		return res.redirect('/student/edit/' + req.param('id'));

			}
			// if (student) {
			// 	var usedEmailError = [{message:'This email is used by another student'}]
		 // 		req.session.flash = {
		 // 			err : usedEmailError
		 // 		}

		 // 		res.locals.flash = _.clone(req.session.flash);

		 // 		return res.redirect('/student/edit/' + req.param('id'));
		 // 	}
		 // 	if (req.param('email').substr(req.param('email').indexOf("@")+1) != "uni.sydney.edu.au") {
		 // 		var domainlError = [{message:'This email domain is not allowed'}]
		 // 		req.session.flash = {
		 // 			err : domainlError
		 // 		}

		 // 		res.locals.flash = _.clone(req.session.flash);

		 // 		return res.redirect('/student/edit/' + req.param('id'));
		 // 	}
			Student.update(req.param('id'),req.params.all()).exec(function studentUpdated(err, student) {
				if (err)  {
					return res.redirect('/student/edit/' + req.param('id'));
				}
				console.log(req.param('degree'));
				
				// if (req.session.Student.id == req.param('id')) {
				// 	//req.session.Student = student;
				// 	//console.log('ff');
				// 	Student.findOne({id : req.session.Student.id}, function foundStudent(err, student) {
				// 		req.session.Student = student;
				// 			console.log(req.session.Student);
				// 	});
				// }
				res.redirect('/student/show/' + req.param('id'));
			});
		});

		
	},
	destroy: function(req, res, next) {
		Student.findOne(req.param('id'), function foundStudent(err, student){
			if (err) return next(err);
			if (!student) return next('User doesn\'t exist.');
			if (req.param('id')==req.session.Student.id) {
				var deleteYourself = [{message:'Cannot delete yourself.'}]
				req.session.flash = {
					err: deleteYourself
				}
				res.redirect('/admin');
				return;
			}
			Student.destroy(req.param('id'), function studentDestroyed(err) {
				if (err) return next(err);
			});
			res.redirect('/admin');
		});
	}
	
};


/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var bcrypt = require('bcrypt');
module.exports = {
	'new': function(req,res) {
		
        //if (req.session.authenticated) req.session.authenticated=false;
        res.view('session/new');
	},

	create: function(req, res, next) {
	    if(!req.param('email') && !req.param('password')){
            var usernamePasswordRequiredError = [{
                name: 'usernamePasswordRequired',
                message: 'You must enter both a username and password. '
             }];
           
            req.session.flash = {
                err: usernamePasswordRequiredError
            };
            res.redirect('/session/new');
            return;
        }

        Student.findOneByEmail(req.param('email'), function foundStudent(err, student){
            if(err) return next(err);

            if(!student){
                var noAccountError = [{name:'noAccount', message: 'The email address '+ req.param('email')+' not found.'}];
                req.session.flash = {
                    err: noAccountError
                };
                res.redirect('/session/new');
                return;
            }

            bcrypt.compare(req.param('password'), student.password, function(err, valid){
                if(err) return next(err);

                // If the password from the form doesn't match the password from the database...
                if (!valid) {
                    var usernamePasswordMismatchError = [{
                        name: 'usernamePasswordMismatch',
                        message: 'Invalid username and password combination.'
                    }]
                    req.session.flash = {
                        err: usernamePasswordMismatchError
                    }
                    res.redirect('/session/new');
                    return;
                }

                // Log user In
                var oldDateObj = new Date();
                var newDateObj = new Date(oldDateObj.getTime()+ 1440000);
                req.session.cookie.expires = newDateObj;
                req.session.authenticated = true;
                req.session.Student = student;

                student.online = true;
                student.save(function(er, student) {
                    if (err) return next(err);
                    if (req.session.Student.admin) {
                        res.redirect('/admin');
                        return;
                    }
                     // Redirect to their profile page if user is found
                     res.redirect('/home');
                });
                
            });
        });
	},
    destroy: function (req,res,next) {
        Student.findOne(req.session.Student.id, function foundStudent(err, foundStudent) {
            var studentId = req.session.Student.id;
            Student.update(studentId, {online:false, chatroom:null}).exec(function studentUpdate(err,student){
                if (err) return next(err);
                Chatroom.message(foundStudent.chatroom, {type: 'leave', student:foundStudent.first_name});
                req.session.destroy();
                res.redirect('/');
            });
        });
        
    }

};


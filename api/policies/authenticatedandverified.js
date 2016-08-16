/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  if (req.session.authenticated) {
  Student.findOne(req.session.Student.id).exec(function studentCB(err, student) {
		if(err) {
			next(err);
		}
		//console.log('hi');
		//console.log(student);
		if(student.verified)
		{
			
			res.locals.flash = {};
			if (!req.session.flash) return next();
			res.locals.flash = _.clone(req.session.flash);
			req.session.flash = {};
			next();
			return;
		}
		else {
			res.redirect('/validate');
		}
	});
  	return;
  }

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  res.redirect('/session/new');
  //return res.forbidden('You are not permitted to perform this action.');
};

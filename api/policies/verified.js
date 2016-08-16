/**
 * verified
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

  Student.findOne(req.session.Student.id).exec(function studentCB(err, student) {
		if(err) {
			ok(err);
		}
		if(student.verified)
		{
			
			res.locals.flash = {};
			if (!req.session.flash) return ok();
			res.locals.flash = _.clone(req.session.flash);
			req.session.flash = {};
			ok();
			return;
		}
		else {
			res.redirect('/validate');
		}
	});
};

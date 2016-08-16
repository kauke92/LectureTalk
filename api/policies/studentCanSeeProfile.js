module.exports = function(req,res, ok) {
	if (!req.session.authenticated) {
		var noRightError = [{name: 'noRights', message:'You must log in.'}]
		req.session.flash = {
			err: noRightError
		}
		res.redirect('/session/new');
		return;
	}
	if (req.session.Student.admin) {
		res.locals.flash = {};
		if (!req.session.flash) return ok();
		res.locals.flash = _.clone(req.session.flash);
		req.session.flash = {};
		ok();
		return;
	}
	Student.findOne(req.session.Student.id).exec(function studentCB(err, student) {
		if(err) {
			ok(err);
		}
		if(student.verified)
		{
			var sessionStudentMatchesId = req.session.Student.id == req.param('id');
			var isAdmin = req.session.Student.admin;
			if (!(sessionStudentMatchesId || isAdmin)) {

				var noRightError = [{name: 'noRights', message:'You must be an admin.'}]
				req.session.flash = {
				err: noRightError
					}
				res.redirect('/session/new');
				return;
			}
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
	}) 
	
	
}
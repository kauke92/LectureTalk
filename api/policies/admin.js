module.exports = function(req,res,ok) {
	

	if (req.session.Student && req.session.Student.admin) {
		res.locals.flash = {};
		if (!req.session.flash) return ok();
		res.locals.flash = _.clone(req.session.flash);
		req.session.flash = {};
		ok();
		return;
	}

	var requireAdminError = [{name: 'requireAdminError', message: 'You must be an admin'}]
	req.session.flash = {
		err: requireAdminError
	}
	res.redirect('session/new');
	return;
}
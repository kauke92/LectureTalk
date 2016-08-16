module.exports = function(req, res, next) {

	Student.findOne(req.session.Student.id).exec(function studentCB(err, student) {
		if(student.verified)
		{
			next();
		}
		else {
			res.redirect('/validate');
			return res.forbidden('You must verify your email.');
		}
	}) 
	
	
}
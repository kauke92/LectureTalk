
module.exports = function(req, res, next) {

 	if (!req.session.authenticated) return res.redirect('/home');
 	if (req.session.Student.admin) return next();
 	Student.findOne({id: req.session.Student.id}).populate('courses').exec(function DoA(err, student) {
 		//console.log('length '+ student.courses.length);
 	 	var i=0;
 	 	function seri1() {
 	 		//console.log('i '+i);
 	 		//console.log('unit_code '+ student.courses[i].unit_code);
 	 		//console.log(req.params.all());
 	 		if (student.courses[i].unit_code == req.param('id')) {
 	 			return next();
 	 		}
 	 		i++;
 	 		if (i==student.courses.length) 
		  		return res.redirect('/home')
		  	else return seri1();					
		}
		if (student.courses.length>0) seri1()
 	 	else return res.redirect('/home');
 	});
 			
};

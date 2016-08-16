
module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
 	if (!req.session.authenticated) return res.redirect('/home');
 	if (req.session.Student.admin) return next();
 	Student.findOne({id: req.session.Student.id}).populate('courses').exec(function DoA(err, student) {
 	 	var i=0;
 	 	function seri1() {
 	 		Course.findOne({id:student.courses[i].id}).populate('lecturestreams').exec(function doB(err, course){
 	 			var j=0;
 	 			function seri2() {
 	 				Lecturestream.findOne({id:course.lecturestreams[j].id}).populate('chatrooms').exec(function doC(err, lecturestream){
 	 					var k=0;
 	 					function seri3() {
 	 						if ((lecturestream.chatrooms[k].id==Number(req.param('id')))
 	 						&& (Date.parse(lecturestream.chatrooms[k].start_time) <= Date.parse(new Date()))) {
		  						return next();
		  					}
		  					k++;
		  					if (k<lecturestream.chatrooms.length) return seri3() 
		  					else {
		  						j++;
		  						if (j==course.lecturestreams.length) {
		  							j=0;
		  							i++;
		  							if (i==student.courses.length) {
		  								res.redirect('/home');  
										return;
		  							} else return seri1();
		  						} else return seri2();
		  					}
 	 					}
 	 					seri3();
 	 				});
 	 			}
 	 			seri2();
 	 		});
 	 	}
 	 	if (student.courses.length>0) seri1()
 	 	else return res.redirect('/home');
 	});
 			
};

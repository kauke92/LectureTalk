Course.find({}).exec(function courseCB(err, found) {
	Student.findOne({}).exec(function studentCB(err, studentFound) {
		found.students.add(studentFound);
		found.save();
	});
});
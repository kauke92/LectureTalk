var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'lecturetalkteam@gmail.com',
        pass: 'lecturetalkteam123'
    }
});

module.exports = {

  attributes: {
  	email: {
  		type: 'string',
  		required: true
  	},
    admin: {
      type: 'boolean',
      defaultsTo: true
    },
    code: {
      type: 'string'
    },
    verified: {
      type: 'boolean',
      defaultsTo: false
    },
    online: {
      type: 'boolean',
      defaultsTo: false
    },
  	password: {
  		type: 'string',
  		required: true
  	},
  	first_name: {
  		type: 'string',
  		required: true
  	},
  	last_name: {
  		type: 'string',
  		required: true
  	},
  	degree:  {
  		//model: 'Course',
      type: 'string',
  		required: false
  	},
  	courses: {
  		collection: 'course',
  		via: 'students',
  		dominant: true,
  		required: false
  	},
    chatroom: {
      model: 'chatroom',
      via: 'students',
      required: false
    },
    
    toJSON: function() {
      var obj = this.toObject();
     delete obj.password;
     delete obj.confirm_password;
     delete obj.createdAt;
     delete obj.updatedAt;
     return obj;
     }

  },
  
  beforeCreate: function (attrs, next) {

    if (attrs.email.substr(attrs.email.indexOf("@")+1) == "uni.sydney.edu.au") {
      Student.findOneByEmail(attrs.email, function foundStudent(err, student){
            
            if(student){
                return next({err: "The email already registered"});

            } 
            else {
              
              if (!attrs.password || attrs.password!=attrs.confirm_password ) {
                   return next({err: ["The passwords do not match. Please retype!"]});
              } else {

                      // attrs.code = Math.floor(Math.random()*100000000) .toString(); //needs to be a hash
                      attrs.code = "123456";
                      attrs.degree = 'Unknown'
                      var bcrypt = require('bcrypt');
                      
                      bcrypt.genSalt(10, function(err, salt) {
                        if (err) return next(err);

                        bcrypt.hash(attrs.password, salt, function(err, hash) {
                          if (err) return next(err);

                          attrs.password = hash;
                          next();
                        });
                      });

                      var mailOptions = {
                           from: 'LectureTalk Admin Team <lecturetalkteam@gmail.com>', // sender address
                           to: attrs.email, // list of receivers
                           subject: 'Confirmation Code', // Subject line
                           html: 'Hi ' + attrs.first_name +'. The code is ' + attrs.code // html body
                      };
                      console.log('here');
                      transporter.sendMail(mailOptions, function(error, info){
                        
                      });                
                }
             }
      });
    } else {
      return next({err: "The email domain isn't allowed"});
    }
  }

};



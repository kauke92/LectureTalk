/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:d
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/':{
    view: 'homepage'
  },
  '/home': {
    controller: 'CourseController',
    action: 'loggedinhome'
  },
  '/student/new' : {
    controller: 'StudentController',
    action: 'new'
  },
  '/student/show' : 'StudentController.show',
  '/student' : 'StudentController.index',
  'get /login': {
    view : 'homepage'
  },

  'get /signup': 'StudentController.new',
  'post /login': 'SessionController.create',
  'post /signup': 'StudentController.create',

  'post /ajax/postmessage': 'MessageController.create',
  'post /ajax/likemessage': 'MessageController.like',

  'get /chatroom': 'ChatroomController.view',
  'get /chatroom/connect': 'ChatroomController.connect',
  'get /chatroom/disconnect': 'ChatroomController.disconnect',
  // 'get /course/show/:unit_code': 'CourseController.findByUnit_code',
  'get /course/search': 'CourseController.search',
  'get /course/add': 'CourseController.add',
  'post /course/delete' : 'CourseController.delete',
  'get /course/manage': 'CourseController.manage',
  'get /course/delete_validate': 'CourseController.delete_validate',
  'get /validate' : {
    view: 'validate'
  },    
  'get /course/exceededcp': {
    view: '/course/exceededcp'
  },
  'get /course/duplicate_course': {
    view: '/course/duplicate_course'
  },
  '/compare' : 'StudentController.compare',
  '/admin' : 'StudentController.admin',
  '/course/new' : 'CourseController.new',
  '/courses' : 'CourseController.index',
  '/course/show' : 'CourseController.show',
  '/course/edit' : 'CourseController.edit'




  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  *  If a request to a URL doesn't match any of the custom routes above, it  *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};

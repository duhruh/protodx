/**
 * AuthController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    
  login: function (req, res) {
    if(typeof req.body.email === 'undefined' || typeof req.body.password === 'undefined'){
        res.json({error: "Invalid username or password"}, 400);
    }else{
        var bcrypt = require('bcrypt');
        User.findOneByEmail(req.body.email).done(function (err, user) {
          if (err) res.json({ error: 'DB error' }, 500);

          if (user) {
            bcrypt.compare(req.body.password, user.password, function (err, match) {
              if (err) res.json({ error: 'Server error' }, 500);

              if (match) {
                // password match
                req.session.user = user;
                req.session.authenticated = true;
                res.json(user);
              } else {
                // invalid password
                if (req.session.user) req.session.user = null;
                res.json({ error: 'Invalid password' }, 400);
              }
            });
          } else {
            res.json({ error: 'User not found' }, 404);
          }
        });
    }
  },

  logout: function (req, res){
    if(req.session.authenticated){
      req.session.authenticated = false;
    }
    res.json(200);
  },


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to AuthController)
   */
  _config: {blueprints: { rest: false, actions: false }}  


  
};

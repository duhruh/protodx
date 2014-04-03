/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    
    /* e.g.
    nickname: 'string'
    */
    email:{
        type: 'email',
        unique: true,
        required: true
    },
    password:{
        type: 'string',
        required: true
    },
    first_name: 'string',
    last_name: 'string'
  },
  beforeCreate: function (attrs, next) {

    // Salt the pasword
    var bcrypt = require('bcrypt');

    bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);

      bcrypt.hash(attrs.password, salt, function(err, hash) {
        if (err) return next(err);

        attrs.password = hash;
        next();
      });
    });
  }
};

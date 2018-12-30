// Requiring our models
const db = require("../models");
const passport = require('passport');
require('../config/passport')(passport);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');


// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all users
  app.get("/api/users", function(req, res) {
    db.User.findAll({
    }).then(function(x) {
      res.json(x);
    });
  });
  
  // GET route for retrieving a single user
  app.get("/api/users/:id", function(req, res) {
    db.User.findOne({
      where: {
        id: req.params.id
      },
    }).then(function(x) {
      res.json(x);
    });
  });

  // PUT route for updating users
  app.put("/api/users/:id", function(req, res) {
    db.User.update({
        Active: req.body.Active
      }, { 
        where: {
          id: req.body.id
        }
      }).then(function(x) {
        res.json(x);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  // POST route for saving a new user
  app.post("/api/users", function(req, res) {
    db.User.create(req.body).then(function(x) {
      res.json(x);
    });
  });

  // DELETE route for deleting a user 
  app.delete("/api/users/:id", function(req, res) {
    db.User.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(x) {
      res.json(x);
    });
  });
  
  app.post('/api/signin', function(req, res) {
    db.User.findOne({
        where: {
            Username: req.body.Username
          },
    }).done(function(user, err) {
      const pwd = user.dataValues.Password
      if (err) throw err;
      if (!user) {
        console.log('there was no user');
        res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
      } else {
        // check if password matches
          bcrypt.compare(req.body.Password, pwd, function (err, isMatch) {
          console.log('isMatch: ', isMatch);
          if (isMatch && !err) {
            console.log('isMatch: ', isMatch, ' password was: ', req.body.Password);
            // if user is found and password is right create a token
            let token = jwt.sign(user.toJSON(), 'mysecret');
            // return the information including token as JSON
            res.json({success: true, token: 'JWT ' + token, user: user.toJSON()});
          } else {
            console.log('auth failed');
            res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
          }
        });
      }
    });
  });

};
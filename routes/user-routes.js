// Requiring our models
const db = require("../models");
const passport = require('passport');
require('../config/passport')(passport);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');


// Routes
// =============================================================
module.exports = function (app) {

  // GET route for getting all users
  app.get("/api/users", function (req, res) {
    if (passport.authenticate('jwt', { session: false })) {
      db.User.findAll({
      }).then(function (x) {
        let z = [];
        x.forEach(y => {
          const user = {
          Username: y.Username,
          FirstName: y.FirstName,
          LastName: y.LastName,
          FranchiseId: y.FranchiseId,
          Phone: y.Phone,
          Email: y.Email,
          Role: y.Role,
          id: y.id
          }
          z.push(user);
        });
        res.json(z);
      });
    }
  });

  // GET route for retrieving a single user
  app.get("/api/users/:id", function (req, res) {
    if (passport.authenticate('jwt', { session: false })) {
      db.User.findOne({
        where: {
          id: req.params.id
        },
      }).then(function (y) {
        const user = {
          Active: y.Active,
          Username: y.Username,
          FirstName: y.FirstName,
          LastName: y.LastName,
          FranchiseId: y.FranchiseId,
          Phone: y.Phone,
          Email: y.Email,
          Role: y.Role,
          id: y.id
          }
        res.json(user);
      });
    }
  });

  // PUT route for updating users
  app.put("/api/users/:id", function (req, res) {
    if (passport.authenticate('jwt', { session: false })) {
      console.log('req.body: ', req.body);
      db.User.update({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Phone: req.body.Phone,
        Role: req.body.Role,
        Active: req.body.Active
      }, {
          where: {
            id: req.body.id
          }
        }).then(function (x) {
          res.json(x);
        })
        .catch(function (err) {
          res.json(err);
        });
    }
  });

  // POST route for saving a new user
  app.post("/api/users", function (req, res) {
    if (passport.authenticate('jwt', { session: false })) {
      db.User.create(req.body).then(function (x) {
        res.json(x);
      });
    }
  });

  // DELETE route for deleting a user 
  app.delete("/api/users/:id", function (req, res) {
    if (passport.authenticate('jwt', { session: false })) {
      if (passport.authenticate('jwt', { session: false })) {
        db.User.destroy({
          where: {
            id: req.params.id
          }
        }).then(function (x) {
          res.json(x);
        });
      }
    }
  });

  app.post('/api/signin', function (req, res) {
    if (passport.authenticate('jwt', { session: false })) {
      db.User.findOne({
        where: {
          Username: req.body.Username
        },
      }).done(function (user, err) {
        const pwd = user.dataValues.Password
        const returnInfo = {
          Username: user.dataValues.Username,
          FirstName: user.dataValues.FirstName,
          LastName: user.dataValues.LastName,
          FranchiseId: user.dataValues.FranchiseId,
          Phone: user.dataValues.Phone,
          Role: user.dataValues.Role,
          createdAt: user.dataValues.createdAt,
          id: user.dataValues.id
        }
        if (err) throw err;
        if (!user) {
          res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' });
        } else {
          // check if password matches
          bcrypt.compare(req.body.Password, pwd, function (err, isMatch) {
            if (isMatch && !err) {
              // if user is found and password is right create a token
              let token = jwt.sign(user.toJSON(), 'mysecret');
              // return the information including token as JSON
              res.json({ success: true, token: 'JWT ' + token, user: returnInfo });
            } else {
              res.status(401).send({ success: false, msg: 'Authentication failed. Wrong password.' });
            }
          });
        }
      });
    }
  });

};
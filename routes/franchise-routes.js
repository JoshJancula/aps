// Requiring our models
const db = require("../models");
const passport = require('passport');
require('../config/passport')(passport);

// Routes
// =============================================================
module.exports = function (app) {

  // GET route for getting all franchise locations
  app.get("/api/franchises", function (req, res) {
    if (passport.authenticate('jwt', { session: false })) {
      db.Franchise.findAll({
        include: [db.User, db.Appointment, db.Invoice],
      }).then(function (x) {
        res.json(x);
      });
    }
  });

  // GET route for retrieving a single franchise
  app.get("/api/franchises/:id", function (req, res) {
    console.log('req.params: ', req.params.id);
      console.log('req.body: ', req.body.id);
    if (passport.authenticate('jwt', { session: false })) {
      // console.log('req.params: ', req.params.id);
      // console.log('req.body: ', req.body.id);
      db.Franchise.findOne({
        where: {
          id: req.params.id
        },
        include: [db.User, db.Appointment, db.Invoice],
      }).then(function (x) {
        res.json(x);
      });
    }
  });

  // POST route for saving a new franchise
  app.post("/api/franchises", function (req, res) {
    if (passport.authenticate('jwt', { session: false })) {
      db.Franchise.create(req.body).then(function (x) {
        res.json(x);
      });
    } else {
      console.log('error authenticating');
    }
  });

  // PUT route for updating franchise
  app.put("/api/franchises/:id", function (req, res) {
    if (passport.authenticate('jwt', { session: false })) {
      db.Franchise.update({
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

  // DELETE route for deleting a franchise location
  app.delete("/api/franchises/:id", function (req, res) {
    if (passport.authenticate('jwt', { session: false })) {
      db.Franchise.destroy({
        where: {
          id: req.params.id
        }
      }).then(function (x) {
        res.json(x);
      });
    }
  });

};
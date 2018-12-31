// Requiring our models
const db = require("../models");
const passport = require('passport');
require('../config/passport')(passport);

// Routes
// =============================================================
module.exports = function (app) {

  // GET route for getting all clients
  app.get("/api/clients", function (req, res) {
    if (passport.authenticate(req.headers.authorization, { session: false })) {
      db.Client.findAll({
      }).then(function (x) {
        res.json(x);
      });
    }
  });

  // GET route for retrieving a single client
  app.get("/api/clients/:id", function (req, res) {
    if (passport.authenticate(req.headers.authorization, { session: false })) {
      db.Client.findOne({
        where: {
          id: req.params.id
        },
      }).then(function (x) {
        res.json(x);
      });
    }
  });

  // POST route for saving a new client
  app.post("/api/clients", function (req, res) {
    if (passport.authenticate(req.headers.authorization, { session: false })) {
      db.Client.create(req.body).then(function (x) {
        res.json(x);
      });
    } else {
      console.log('error authenticating');
    }
  });

  // PUT route for updating client
  app.put("/api/clients/:id", function (req, res) {
    if (passport.authenticate(req.headers.authorization, { session: false })) {
      db.Client.update({
        StreetAddress: req.body.StreetAddress,
        City: req.body.City,
        State: req.body.State,
        Zip: req.body.Zip,
        Description: req.body.Description,
        Email: req.body.Email,
        Phone: req.body.Phone,
        ContactPerson: req.body.ContactPerson
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

  // DELETE route for deleting a client location
  app.delete("/api/clients/:id", function (req, res) {
    if (passport.authenticate(req.headers.authorization, { session: false })) {
      db.Client.destroy({
        where: {
          id: req.params.id
        }
      }).then(function (x) {
        res.json(x);
      });
    }
  });

};
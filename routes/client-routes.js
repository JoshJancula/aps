const db = require("../models");
const JancstaPort = require('../config/jancsta');

// Routes
// =============================================================
module.exports = function (app) {

  // GET route for getting all clients
  app.get("/api/clients", function (req, res) {
    let jancsta = new JancstaPort(req.headers.authorization.toString());
    if (jancsta) {
      db.Client.findAll({
      }).then(function (x) {
        res.json(x);
      });
    } else {
      res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
    }
  });

  // GET route for retrieving a single client
  app.get("/api/clients/:id", function (req, res) {
    let jancsta = new JancstaPort(req.headers.authorization.toString());
    if (jancsta) {
      db.Client.findOne({
        where: {
          id: req.params.id
        },
      }).then(function (x) {
        res.json(x);
      });
    } else {
      res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
    }
  });

  // POST route for saving a new client
  app.post("/api/clients", function (req, res) {
    let jancsta = new JancstaPort(req.headers.authorization.toString());
    if (jancsta) {
      db.Client.create(req.body).then(function (x) {
        res.json(x);
      });
    } else {
      res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
    }
  });

  // PUT route for updating client
  app.put("/api/clients/:id", function (req, res) {
    let jancsta = new JancstaPort(req.headers.authorization.toString());
    if (jancsta) {
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
    } else {
      res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
    }
  });

  // DELETE route for deleting a client location
  app.delete("/api/clients/:id", function (req, res) {
    let jancsta = new JancstaPort(req.headers.authorization.toString());
    if (jancsta) {
      db.Client.destroy({
        where: {
          id: req.params.id
        }
      }).then(function (x) {
        res.json(x);
      });
    } else {
      res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
    }
  });

};
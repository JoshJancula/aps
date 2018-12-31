// Requiring our models
const db = require("../models");
const passport = require('passport');
require('../config/passport')(passport);

// Routes
// =============================================================
module.exports = function (app) {

  // GET route for getting all invoices
  app.get("/api/invoices", function (req, res) {
    if (passport.authenticate(req.headers.authorization, { session: false })) {
      db.Invoice.findAll({
      }).then(function (x) {
        res.json(x);
      });
    }
  });

  // GET route for retrieving a single invoice
  app.get("/api/invoices/:id", function (req, res) {
    if (passport.authenticate(req.headers.authorization, { session: false })) {
      db.Invoice.findOne({
        where: {
          id: req.params.id
        },
        include: [db.User, db.Appointment, db.Invoice],
      }).then(function (x) {
        res.json(x);
      });
    }
  });

  // POST route for saving a new invoice
  app.post("/api/invoices", function (req, res) {
    if (passport.authenticate(req.headers.authorization, { session: false })) {
      db.Invoice.create(req.body).then(function (x) {
        res.json(x);
      });
    } else {
      console.log('error authenticating');
    }
  });

  // PUT route for updating invoice
  app.put("/api/invoices/:id", function (req, res) {
    if (passport.authenticate(req.headers.authorization, { session: false })) {
      db.Invoice.update({
        Total: req.body.Total,
        Paid: req.body.Paid,
        PaymentMethod: req.body.PaymentMethod,
        PO: req.body.PO,
        RO: req.body.RO,
        VIN: req.body.VIN,
        Stock: req.body.Stock,
        Description: req.body.Description,
        Comments: req.body.Comments,
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

  // DELETE route for deleting a invoice location
  app.delete("/api/invoices/:id", function (req, res) {
    if (passport.authenticate(req.headers.authorization, { session: false })) {
      db.Invoice.destroy({
        where: {
          id: req.params.id
        }
      }).then(function (x) {
        res.json(x);
      });
    }
  });

};
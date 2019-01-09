const db = require("../models");
const JancstaPort = require('../config/jancsta');

// Routes
// =============================================================
module.exports = function (app) {

  // GET route for getting all invoices
  app.get("/api/invoices", function (req, res) {
    let jancsta = new JancstaPort(req.headers.authorization.toString(), 'super');
    if (jancsta) {
      db.Invoice.findAll({
      }).then(function (x) {
        res.json(x);
      });
    }
  });

  // GET route for retrieving a single invoice
  app.get("/api/invoices/:id", function (req, res) {
    let jancsta = new JancstaPort(req.headers.authorization.toString(), 'super');
    if (jancsta) {
      db.Invoice.findOne({
        where: {
          id: req.params.id
        },
      }).then(function (x) {
        res.json(x);
      });
    }
  });

  // POST route for saving a new invoice
  app.post("/api/invoices", function (req, res) {
    let jancsta = new JancstaPort(req.headers.authorization.toString(), 'super');
    if (jancsta) {
      db.Invoice.create(req.body).then(function (x) {
        res.json(x);
      });
    } else {
      console.log('error authenticating');
    }
  });

  // PUT route for updating invoice
  app.put("/api/invoices/:id", function (req, res) {
    let jancsta = new JancstaPort(req.headers.authorization.toString(), 'super');
    if (jancsta) {
      db.Invoice.update({
        Total: req.body.Total,
        Paid: req.body.Paid,
        PaymentMethod: req.body.PaymentMethod,
        PO: req.body.PO,
        CheckNumber: req.body.CheckNumber,
        RO: req.body.RO,
        VIN: req.body.VIN,
        Stock: req.body.Stock,
        PPF: req.body.PPF,
        OtherServices: req.body.OtherServices,
        Stripes: req.body.Stripes,
        Tint: req.body.Tint,
        EditedBy: req.body.EditedBy,
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
    let jancsta = new JancstaPort(req.headers.authorization.toString(), 'super');
    if (jancsta) {
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
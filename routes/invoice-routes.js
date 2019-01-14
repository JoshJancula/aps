const db = require("../models");
const JancstaPort = require('../config/jancsta');
// const jancsta = new JancstaPort();
const moment = require('moment');

// Routes
// =============================================================
module.exports = function (app) {

  // GET route for getting all invoices
  app.get("/api/invoices", function (req, res) {
    let jancsta = new JancstaPort(req.headers.authorization.toString());
    if (jancsta) {
      db.Invoice.findAll({
      }).then(function (x) {
        res.json(x);
      });
    } else {
      res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
    }
  });

  // GET route for retrieving a single invoice
  app.get("/api/invoices/:id", function (req, res) {
    let jancsta = new JancstaPort(req.headers.authorization.toString());
    if (jancsta) {
      db.Invoice.findOne({
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

  // POST route for saving a new invoice
  app.post("/api/invoices", function (req, res) {
    let jancsta = new JancstaPort(req.headers.authorization.toString());
    if (jancsta) {
      db.Invoice.create(req.body).then(function (x) {
        res.json(x);
      });
    } else {
      res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
    }
  });

  // PUT route for updating invoice
  app.put("/api/invoices/:id", function (req, res) {
    let jancsta = new JancstaPort(req.headers.authorization.toString());
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
    } else {
      res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
    }
  });

  // DELETE route for deleting a invoice location
  app.delete("/api/invoices/:id", function (req, res) {
    let jancsta = new JancstaPort(req.headers.authorization.toString());
    if (jancsta) {
      db.Invoice.destroy({
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


  // POST route for params to enter, search by franchise and dates. Dates default to today
  app.post("/api/invoices/sub/", function (req, res) {
    let jancsta = new JancstaPort(req.headers.authorization.toString());
    if (jancsta) {
      // console.log('jancsta.secret: ', jancsta.secret);
      db.Invoice.findAll({
        where: {
          FranchiseId: req.body.franchise,
        },
      }).then(function (a) {
        let start = moment(req.body.dateFrom).format('MM/DD/YYYY');
        let end = moment(req.body.dateTo).format('MM/DD/YYYY');
        let inv = [];

        a.forEach(b => {
          let createdAt = moment(b.createdAt).format('MM/DD/YYYY');
          if (start !== end) {
            if (moment(createdAt).isBefore(end)) {
              if (moment(createdAt).isAfter(start)) { inv.push(b); }
            }
            if (moment(createdAt).isSame(end)) { inv.push(b); }
            if (moment(createdAt).isSame(start)) { inv.push(b); }
          }
          if (start == end) {
            if (moment(createdAt).isSame(end)) { inv.push(b); }
          }
        });
        res.json(inv);
      });
    } else {
      res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
    }
  });

};
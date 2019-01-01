// Requiring our models
const db = require("../models");
const passport = require('passport');
require('../config/passport')(passport);

// Routes
// =============================================================
module.exports = function (app) {

  // GET route for getting all appointments
  app.get("/api/appointments", function (req, res) {
    if (passport.authenticate(req.headers.authorization, { session: false })) {
      db.Appointment.findAll({
      }).then(function (x) {
        res.json(x);
      });
    }
  });

  // GET route for retrieving a single appointment
  app.get("/api/appointments/:id", function (req, res) {
    console.log('req.params: ', req.params.id);
      console.log('req.body: ', req.body.id);
    if (passport.authenticate(req.headers.authorization, { session: false })) {
      // console.log('req.params: ', req.params.id);
      // console.log('req.body: ', req.body.id);
      db.Appointment.findOne({
        where: {
          id: req.params.id
        },
      }).then(function (x) {
        res.json(x);
      });
    }
  });

  // POST route for saving a new appointment
  app.post("/api/appointments", function (req, res) {
    if (passport.authenticate(req.headers.authorization, { session: false })) {
      db.Appointment.create(req.body).then(function (x) {
        res.json(x);
      });
    } else {
      console.log('error authenticating');
    }
  });

  // PUT route for updating appointment
  app.put("/api/appointments/:id", function (req, res) {
    if (passport.authenticate(req.headers.authorization, { session: false })) {
      db.Appointment.update({
        Date: req.body.Data,
        Location: req.body.Location,
        ContactPerson: req.body.ContactPerson,
        ContactPersonPhone: req.body.ContactPersonPhone,
        ScheduledBy: req.body.ScheduledBy,
        AssignedEmployee: req.body.AssignedEmployee,
        ScheduledById: req.body.ScheduledById,
        AssignedEmployeeId: req.body.AssignedEmployeeId,
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

  // DELETE route for deleting an appointment 
  app.delete("/api/appointments/:id", function (req, res) {
    if (passport.authenticate(req.headers.authorization, { session: false })) {
      db.Appointment.destroy({
        where: {
          id: req.params.id
        }
      }).then(function (x) {
        res.json(x);
      });
    }
  });

};
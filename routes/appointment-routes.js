const db = require("../models");
const JancstaPort = require('../config/jancsta');

//  Routes
// =============================================================
module.exports = (app) => {

	// GET route for getting all appointments
	app.get("/api/appointments/sub/:id", (req, res) => {
		new JancstaPort(req.headers.authorization.toString()).then((bool) => {
			if (bool == true) {
				db.Appointment.findAll({
					where: {
						FranchiseId: req.params.id
					},
				}).then((x) => {
					res.json(x);
				});
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		});
	});

	// GET route for retrieving a single appointment
	app.get("/api/appointments/:id", (req, res) => {
		new JancstaPort(req.headers.authorization.toString()).then((bool) => {
			if (bool == true) {
				db.Appointment.findOne({
					where: {
						id: req.params.id
					},
				}).then((x) => {
					res.json(x);
				});
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		});
	});

	// POST route for saving a new appointment
	app.post("/api/appointments", (req, res) => {
		new JancstaPort(req.headers.authorization.toString()).then((bool) => {
			if (bool == true) {
				db.Appointment.create(req.body).then((x) => {
					res.json(x);
				});
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		});
	});

	// PUT route for updating appointment
	app.put("/api/appointments/:id", (req, res) => {
		new JancstaPort(req.headers.authorization.toString()).then((bool) => {
			if (bool == true) {
				db.Appointment.update({
					Date: req.body.Date,
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
					}).then((x) => {
						res.json(x);
					})
					.catch((err) => {
						res.json(err);
					});
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		});
	});

	// DELETE route for deleting an appointment 
	app.delete("/api/appointments/:id", (req, res) => {
		new JancstaPort(req.headers.authorization.toString()).then((bool) => {
			if (bool == true) {
				db.Appointment.destroy({
					where: {
						id: req.params.id
					}
				}).then((x) => {
					res.json(x);
				});
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		});
	});

};
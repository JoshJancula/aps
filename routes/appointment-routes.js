const db = require("../models");
const JancstaPort = require('../config/jancsta');
const jancsta = new JancstaPort();

// Master Routes
// =============================================================
module.exports = function (app) {

	// GET route for getting all appointments
	app.get("/api/appointments", function (req, res) {
		let jancsta = new JancstaPort(req.headers.authorization.toString());
		setTimeout(() => {
			if (jancsta.bool == true) {
				db.Appointment.findAll({
				}).then(function (x) {
					res.json(x);
				});
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		}, 500);
	});

	// GET route for retrieving a single appointment
	app.get("/api/appointments/:id", function (req, res) {
		let jancsta = new JancstaPort(req.headers.authorization.toString());
		setTimeout(() => {
			if (jancsta.bool == true) {
				db.Appointment.findOne({
					where: {
						id: req.params.id
					},
				}).then(function (x) {
					res.json(x);
				});
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		}, 500);
	});

	// POST route for saving a new appointment
	app.post("/api/appointments", function (req, res) {
		let jancsta = new JancstaPort(req.headers.authorization.toString());
		setTimeout(() => {
			if (jancsta.bool == true) {
				db.Appointment.create(req.body).then(function (x) {
					res.json(x);
				});
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		}, 500);
	});

	// PUT route for updating appointment
	app.put("/api/appointments/:id", function (req, res) {
		let jancsta = new JancstaPort(req.headers.authorization.toString());
		setTimeout(() => {
			if (jancsta.bool == true) {
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
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		}, 500);
	});

	// DELETE route for deleting an appointment 
	app.delete("/api/appointments/:id", function (req, res) {
		let jancsta = new JancstaPort(req.headers.authorization.toString());
		setTimeout(() => {
			if (jancsta.bool == true) {
				db.Appointment.destroy({
					where: {
						id: req.params.id
					}
				}).then(function (x) {
					res.json(x);
				});
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		}, 500);
	});

	// Subscriber routes
	//=============================================================================

	// GET route for getting all appointments
	app.get("/api/appointments/sub/:id", function (req, res) {
		let jancsta = new JancstaPort(req.headers.authorization.toString());
		setTimeout(() => {
			if (jancsta.bool == true) {
				db.Appointment.findAll({
					where: {
						FranchiseId: req.params.id
					},
				}).then(function (x) {
					res.json(x);
				});
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		}, 500);
	});

	// GET route for retrieving a single appointment
	app.get("/api/appointments/:id", function (req, res) {
		let jancsta = new JancstaPort(req.headers.authorization.toString());
		setTimeout(() => {
			if (jancsta.bool == true) {
				db.Appointment.findOne({
					where: {
						id: req.params.id
					},
				}).then(function (x) {
					res.json(x);
				});
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		}, 500);
	});

	// POST route for saving a new appointment
	app.post("/api/appointments", function (req, res) {
		let jancsta = new JancstaPort(req.headers.authorization.toString());
		setTimeout(() => {
			if (jancsta.bool == true) {
				db.Appointment.create(req.body).then(function (x) {
					res.json(x);
				});
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		}, 500);
	});

	// PUT route for updating appointment
	app.put("/api/appointments/:id", function (req, res) {
		let jancsta = new JancstaPort(req.headers.authorization.toString());
		setTimeout(() => {
			if (jancsta.bool == true) {
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
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		}, 500);
	});

	// DELETE route for deleting an appointment 
	app.delete("/api/appointments/:id", function (req, res) {
		let jancsta = new JancstaPort(req.headers.authorization.toString());
		setTimeout(() => {
			if (jancsta.bool) {
				db.Appointment.destroy({
					where: {
						id: req.params.id
					}
				}).then(function (x) {
					res.json(x);
				});
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		}, 500);
	});

};
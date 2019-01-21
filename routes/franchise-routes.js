const db = require("../models");
const JancstaPort = require('../config/jancsta');

// Routes
// =============================================================
module.exports = function (app) {

	// GET route for getting all franchise locations
	app.get("/api/franchises", function (req, res) {
		let jancsta = new JancstaPort(req.headers.authorization.toString());
		setTimeout(() => {
			if (jancsta.bool == true) {
				db.Franchise.findAll({
					include: [db.User],
				}).then(function (x) {
					res.json(x);
				});
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		}, 500);
	});

	// GET route for retrieving a single franchise
	app.get("/api/franchises/:id", function (req, res) {
		let jancsta = new JancstaPort(req.headers.authorization.toString());
		setTimeout(() => {
			if (jancsta.bool == true) {
				db.Franchise.findOne({
					where: {
						id: req.params.id
					},
					include: [db.User],
				}).then(function (x) {
					res.json(x);
				});
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		}, 500);
	});

	// POST route for saving a new franchise
	app.post("/api/franchises", function (req, res) {
		let jancsta = new JancstaPort(req.headers.authorization.toString());
		setTimeout(() => {
			if (jancsta.bool == true) {
				db.Franchise.create(req.body).then(function (x) {
					res.json(x);
				});
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		}, 500);
	});

	// PUT route for updating franchise
	app.put("/api/franchises/:id", function (req, res) {
		let jancsta = new JancstaPort(req.headers.authorization.toString());
		setTimeout(() => {
			if (jancsta.bool == true) {
				db.Franchise.update({
					Active: req.body.Active,
					Phone: req.body.Phone,
					Address: req.body.Address,
					Email: req.body.Email,
					TaxRate: req.body.TaxRate
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

	// DELETE route for deleting a franchise location
	app.delete("/api/franchises/:id", function (req, res) {
		let jancsta = new JancstaPort(req.headers.authorization.toString());
		setTimeout(() => {
			if (jancsta.bool == true) {
				db.Franchise.destroy({
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
const db = require("../models");
const JancstaPort = require('../config/jancsta');

// Routes
// =============================================================
module.exports = (app) => {

	// GET route for getting all clients
	app.get("/api/clients", (req, res) => {
		new JancstaPort(req.headers.authorization.toString()).then((bool) => {
			if (bool == true) {
				db.Client.findAll({
				}).then((x) => {
					res.json(x);
				});
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		});
	});

	// GET route for retrieving a single client
	app.get("/api/clients/:id", (req, res) => {
		new JancstaPort(req.headers.authorization.toString()).then((bool) => {
			if (bool == true) {
				db.Client.findAll({
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

	// POST route for saving a new client
	app.post("/api/clients", (req, res) => {
		new JancstaPort(req.headers.authorization.toString()).then((bool) => {
			if (bool == true) {
				db.Client.create(req.body).then((x) => {
					res.json(x);
				});
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		});
	});

	// PUT route for updating client
	app.put("/api/clients/:id", function (req, res) {
		new JancstaPort(req.headers.authorization.toString()).then((bool) => {
			if (bool == true) {
				db.Client.update({
					Address: req.body.StreetAddress,
					Description: req.body.Description,
					Email: req.body.Email,
					Phone: req.body.Phone,
					ContactPerson: req.body.ContactPerson
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

	// DELETE route for deleting a client location
	app.delete("/api/clients/:id", (req, res) => {
		new JancstaPort(req.headers.authorization.toString()).then((bool) => {
			if (bool == true) {
				db.Client.destroy({
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
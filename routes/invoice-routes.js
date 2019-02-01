const db = require("../models");
const JancstaPort = require('../config/jancsta');
const moment = require('moment');

// Routes
// =============================================================
module.exports = (app) => {

	// GET route for getting all invoices
	app.get("/api/invoices", (req, res) => {
		let jancsta = new JancstaPort(req.headers.authorization.toString());
		setTimeout(() => {
			if (jancsta.bool == true) {
				db.Invoice.findAll({
				}).then((x) => {
					res.json(x);
				});
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		}, 500);
	});

	// GET route for retrieving a single invoice
	app.get("/api/invoices/:id", (req, res) => {
		let jancsta = new JancstaPort(req.headers.authorization.toString());
		setTimeout(() => {
			if (jancsta.bool == true) {
				db.Invoice.findOne({
					where: {
						id: req.params.id
					},
				}).then((x) => {
					res.json(x);
				});
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		}, 500);
	});

	// POST route for saving a new invoice
	app.post("/api/invoices", (req, res) => {
		let jancsta = new JancstaPort(req.headers.authorization.toString());
		setTimeout(() => {
			if (jancsta.bool == true) {
				db.Invoice.create(req.body).then((x) => {
					res.json(x);
				});
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		}, 500);
	});

	// PUT route for updating invoice
	app.put("/api/invoices/:id", (req, res) => {
		let jancsta = new JancstaPort(req.headers.authorization.toString());
		setTimeout(() => {
			if (jancsta.bool == true) {
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
					CalcTax: req.body.CalcTax,
					EditedBy: req.body.EditedBy,
					Description: req.body.Description,
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
		}, 500);
	});

	// DELETE route for deleting a invoice location
	app.delete("/api/invoices/:id", (req, res) => {
		let jancsta = new JancstaPort(req.headers.authorization.toString());
		setTimeout(() => {
			if (jancsta.bool == true) {
				db.Invoice.destroy({
					where: {
						id: req.params.id
					}
				}).then((x) =>{
					res.json(x);
				});
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		}, 500);
	});


	// POST route for params to enter, search by franchise and dates. Dates default to today
	app.post("/api/invoices/sub/", (req, res) => {
		let jancsta = new JancstaPort(req.headers.authorization.toString());
		setTimeout(() => {
			if (jancsta.bool == true) {
				db.Invoice.findAll({
					where: {
						FranchiseId: req.body.franchise,
					},
				}).then((a) => {
					let start = moment(req.body.dateFrom).format('MM/DD/YYYY');
					let end = moment(req.body.dateTo).format('MM/DD/YYYY');
					let inv = [];

					a.forEach(b => {
						let createdAt = moment(b.createdAt).format('MM/DD/YYYY');
						if (moment(start).isSame(end)) {
							if (moment(createdAt).isSame(end) || moment(createdAt).isSame(start)) { inv.push(b); }
						} else {
							if (moment(createdAt).isBefore(end)) {
								if (moment(createdAt).isAfter(start)) { inv.push(b); }
							}
							if (moment(createdAt).isSame(start)) { inv.push(b); }
							if (moment(createdAt).isSame(end)) { inv.push(b); }
						}

					});
					res.json(inv);
				});
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		}, 500);
	});
};
const db = require("../models");
const JancstaPort = require('../config/jancsta');
const bcrypt = require('bcryptjs');
const moment = require('moment');

// Routes
// =============================================================
module.exports = function (app) {

	// GET route for getting all users
	app.get("/api/users", function (req, res) {
		let jancsta = new JancstaPort(req.headers.authorization.toString());
		setTimeout(() => {
			if (jancsta.bool == true) {
				db.User.findAll({
				}).then(function (x) {
					let z = [];
					x.forEach(y => {
						const user = {
							Username: y.Username,
							FirstName: y.FirstName,
							LastName: y.LastName,
							FranchiseId: y.FranchiseId,
							Phone: y.Phone,
							Email: y.Email,
							Role: y.Role,
							id: y.id,
							Active: y.Active
						}
						z.push(user);
					});
					res.json(z);
				});
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		}, 500);
	});

	// GET route for retrieving users by franchise
	app.get("/api/users/:id", function (req, res) {
		let jancsta = new JancstaPort(req.headers.authorization.toString());
		setTimeout(() => {
			if (jancsta.bool == true) {
				db.User.findAll({
					where: {
						FranchiseId: req.params.id
					},
				}).then(function (x) {
					let z = [];
					x.forEach(y => {
						if (y.Active == true) {
							const user = {
								Username: y.Username,
								FirstName: y.FirstName,
								LastName: y.LastName,
								FranchiseId: y.FranchiseId,
								Phone: y.Phone,
								Email: y.Email,
								Role: y.Role,
								id: y.id,
								Active: y.Active
							}
							z.push(user);
						}
					});
					res.json(z);
				});
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		}, 500);
	});

	// PUT route for updating users
	app.put("/api/users/:id", function (req, res) {
		let jancsta = new JancstaPort(req.headers.authorization.toString());
		setTimeout(() => {
			if (jancsta.bool == true) {
				db.User.update({
					FirstName: req.body.FirstName,
					LastName: req.body.LastName,
					Phone: req.body.Phone,
					Role: req.body.Role,
					Active: req.body.Active
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

	// PUT route for updating user password
	app.put("/api/users/:id", function (req, res) {
		let jancsta = new JancstaPort(req.headers.authorization.toString());
		setTimeout(() => {
			if (jancsta.bool == true) {
				db.User.update({
					Password: req.body.Password,
				}, {
						where: {
							id: req.body.id
						}
					}).then(function (x) {
						res.status(200).send({ success: true, msg: 'Success' });
					})
					.catch(function (err) {
						res.json(err);
					});
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		}, 500);
	});

	// POST route for saving a new user
	app.post("/api/users", function (req, res) {
		let jancsta = new JancstaPort(req.headers.authorization.toString());
		setTimeout(() => {
			if (jancsta.bool == true) {
				db.User.create(req.body).then(function (x) {
					res.json(x);
				});
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		}, 500);
	});

	// DELETE route for deleting a user 
	app.delete("/api/users/:id", function (req, res) {
		let jancsta = new JancstaPort(req.headers.authorization.toString());
		setTimeout(() => {
			if (jancsta.bool == true) {
				db.User.destroy({
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

	app.post('/api/signin', function (req, res) {
		db.User.findOne({
			where: {
				Username: req.body.Username
			},
		}).done(function (user, err) {
			if (err) throw err;
			if (!user) {
				res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' });
			} else {
				const pwd = user.dataValues.Password
				const returnInfo = {
					Username: user.dataValues.Username,
					FirstName: user.dataValues.FirstName,
					LastName: user.dataValues.LastName,
					FranchiseId: user.dataValues.FranchiseId,
					Phone: user.dataValues.Phone,
					Role: user.dataValues.Role,
					createdAt: user.dataValues.createdAt,
					id: user.dataValues.id
				}
				if (user.dataValues.Active == false) {
					res.status(403).send({ success: false, msg: `Authentication failed. You're account has been deactivated.` })
				} else {
					// check if password matches
					bcrypt.compare(req.body.Password, pwd, function (err, isMatch) {
						if (isMatch && !err) {
							// if user is found and password is right create a token
							let date = new Date();
							let date2 = moment(date).format('MM/DD/YYYY');
							let hashThis = `${date2}secret`
							bcrypt.genSalt(1, function (err, salt) {
								bcrypt.hash(hashThis, salt, function (err2, hash) {
									res.json({ success: true, token: hash, user: returnInfo });
								});
							});
						} else {
							res.status(401).send({ success: false, msg: 'Authentication failed. Invalid password.' });
						}
					});
				}
			}
		});
	});

};
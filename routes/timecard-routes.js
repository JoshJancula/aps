const db = require("../models");
const JancstaPort = require('../config/jancsta');
const moment = require('moment');

// Routes
// =============================================================
module.exports = (app) => {

    // GET route for all timecards associated with an employee
    app.post("/api/timecards/employee/all/:id", (req, res) => {
        new JancstaPort(req.headers.authorization.toString()).then((bool) => {
			if (bool == true) {
                db.Timecard.findAll({
                    where: {
                        EmployeeId: req.body.EmployeeId
                    },
                }).then((a) => {
                    let cards = [];
                    a.forEach(b => {
                        if (moment(b.Date).isSame(moment(req.body.Date), 'week')) { cards.push(b); }
                    });
                    res.json(cards);
                });
            } else {
                res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
            }
        });
    });

    // GET route for retrieving today's timecards for an employee
    app.get("/api/timecards/employee/today/:id", (req, res) => {
        new JancstaPort(req.headers.authorization.toString()).then((bool) => {
			if (bool == true) {
                db.Timecard.findAll({
                    where: {
                        EmployeeId: req.params.id,
                    },
                }).then((x) => {
                    let cards = [];
                    let today = moment(new Date()).tz("America/Toronto").format('MM/DD/YYYY');
                    x.forEach(entry => {
                        if (moment(today).isSame(entry.Date)) { cards.push(entry); }
                    });
                    res.json(cards);
                });
            } else {
                res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
            }
        });
    });

    // POST route for saving a new timecard
    app.post("/api/timecards", (req, res) => {
        new JancstaPort(req.headers.authorization.toString()).then((bool) => {
			if (bool == true) {
                db.Timecard.create(req.body).then((x) => {
                    res.json(x);
                });
            } else {
                res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
            }
        });
    });

    // PUT route for updating timecard
    app.put("/api/timecards/:id", (req, res) => {
        console.log('req: ', req.body);
        new JancstaPort(req.headers.authorization.toString()).then((bool) => {
			if (bool == true) {
                db.Timecard.update({
                    TimeIn: req.body.TimeIn,
                    TimeOut: req.body.TimeOut,
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

    // DELETE route for deleting a timecard entry 
    app.delete("/api/timecards/:id", (req, res) => {
        new JancstaPort(req.headers.authorization.toString()).then((bool) => {
			if (bool == true) {
                db.Timecard.destroy({
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
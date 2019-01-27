const sgMail = require('@sendgrid/mail');
const JancstaPort = require('../config/jancsta');

module.exports = function (app) {

    app.post("/api/email", function (req, res) {
		let jancsta = new JancstaPort(req.headers.authorization.toString());
        setTimeout(() => {
            if (jancsta.bool == true) {
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                sgMail.send(req.body);
            } else {
                res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
            }
        }, 500);
    });

}
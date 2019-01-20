const sgMail = require('@sendgrid/mail');
const JancstaPort = require('../config/jancsta');

module.exports = function (app) {

    app.post("/api/email", function (req, res) {
		let jancsta = new JancstaPort(req.headers.authorization.toString());
		console.log('made it inside the post');
        setTimeout(() => {
			console.log('jancsta.bool in email: ', jancsta.bool);
            if (jancsta.bool == true) {
				console.log('should be sending sendgrid email now');
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = {
                    to: 'josh@jancula.com',
                    from: 'test@example.com',
                    subject: 'Test message from sendgrid',
                    text: 'testing',
                    html: '<strong>test</strong>',
                };
                sgMail.send(msg);

            } else {
                res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
            }
        }, 500);
    });

}
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const PORT = process.env.PORT || 8080;
const path = require('path');
const cors = require('cors');
const db = require("./models");
const Message = db.sequelize.import('./models/Message.js');

app.use(cors());
app.use(passport.initialize());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended': 'false' }));
app.use('/', express.static(path.join(__dirname, '/client/dist/client')));
app.set('view engine', 'jade');


app.all('*', function (req, res, next) {
    const origin = req.get('origin');
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});


require("./routes/franchise-routes.js")(app);
require("./routes/user-routes.js")(app);
require("./routes/appointment-routes.js")(app);
require("./routes/client-routes.js")(app);
require("./routes/invoice-routes.js")(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // send the error page
    res.status(err.status || 500);
    res.json({
        message: 'error',
        error: err
    });
});


// Syncing sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync().then(function () {
    server.listen(PORT, function () {
        console.log("App listening on PORT " + PORT);
        console.log('===================================');

        io.on('connection', (socket) => {

            // on connection get all messages for user
            socket.on('connectionInfo', function (data) {
                console.log('data: ', data);
                let messages = [];
                Message.findAll({
                    where: {
                        AuthorId: data.AuthorId
                    },
                }).then(function (x) {
                    x.forEach(item => {
                        messages.push(item);
                    });
                    Message.findAll({
                        where: {
                            RecipientId: data.AuthorId
                        },
                    }).then(function (y) {
                        y.forEach(z => {
                            messages.push(z);
                        });
                        socket.emit('message', {
                            messages
                        });
                    });
                });
            });

            // socket.on('update', function (data) {
            //     switch (data.Action) {
			// 		case 'franchises': socket.broadcast.emit('update', { Action: 'updateFranchises' }); break;
			// 		case 'clients': socket.broadcast.emit('update', { Action: 'updateClients' }); break;
			// 		case 'users': socket.broadcast.emit('update', { Action: 'updateUsers' }); break;
			// 		case 'invoices': socket.broadcast.emit('update', { Action: 'updateInvoices' }); break;
			// 		case 'appointments': socket.broadcast.emit('update', { Action: 'updateAppointments' }); break;
			// 	}
            // });

            socket.on('update', function (data) {
                if (data.Action === 'clients') {
                    socket.broadcast.emit('update', {
                        Action: 'updateClients',
                    });
                } else if (data.Action === 'franchises') {
                    socket.broadcast.emit('update', {
                        Action: 'updateFranchises',
                    });
                } else if (data.Action === 'users') {
                    socket.broadcast.emit('update', {
                        Action: 'updateUsers',
                    });
                } else if (data.Action === 'invoices') {
                    socket.broadcast.emit('update', {
                        Action: 'updateInvoices',
                    });
                } else if (data.Action === 'appointments') {
					socket.broadcast.emit('update', {
                        Action: 'updateAppointments',
                    });
                }
            });

            // update that the recipient read the message
            socket.on('read', function (data) {
              Message.update({
                Read: data.Read
              }, {
                  where: {
                    id: data.id
                  }
                }).then(function (x) {
                  console.log('message status updated');
                })
                .catch(function (err) {
                  res.json(err);
                });
            });

            // when new message is created
            socket.on('message', function (data) {
              Message.create({
                Author: data.Author,
                AuthorId: data.AuthorId,
                Recipient: data.Recipient,
                RecipientId: data.RecipientId,
                Content: data.Content,
                MessageType: data.MessageType,
                Read: data.Read
              }).then(function (data) {
                socket.emit('message', {
                  data
                });
                socket.broadcast.emit('message', {
                  data
                });
              });
            });

        });

    });
});
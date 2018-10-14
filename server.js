const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const db = require("./models");
const PORT = process.env.PORT || 8080;
const app = express();
const path = require('path');

app.use(passport.initialize());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(express.static(path.join(__dirname, '/client/dist/client')));
app.set('view engine', 'jade');

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'https://aps-josh.herokuapp.com');
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200')
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	// res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	// res.header('Access-Control-Allow-Credentials', 'true');
	next();
});

require("./routes/franchise-routes.js")(app);
require("./routes/user-routes.js")(app);
require("./routes/service-routes.js")(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// Syncing sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});
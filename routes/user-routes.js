// Requiring our models
const db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all users
  app.get("/api/users", function(req, res) {
    db.User.findAll({
        include: [db.Message, db.Post],
    }).then(function(x) {
      res.json(x);
    });
  });
  
  // GET route for retrieving a single user
  app.get("/api/users/:id", function(req, res) {
    db.User.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Message, db.Post],
    }).then(function(x) {
      res.json(x);
    });
  });

  // PUT route for updating users
  app.put("/api/users/:id", function(req, res) {
    db.User.update({
        Active: req.body.Active
      }, { 
        where: {
          id: req.body.id
        }
      }).then(function(x) {
        res.json(x);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  // POST route for saving a new user
  app.post("/api/users", function(req, res) {
    db.User.create(req.body).then(function(x) {
      res.json(x);
    });
  });

  // DELETE route for deleting a user 
  app.delete("/api/users/:id", function(req, res) {
    db.User.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(x) {
      res.json(x);
    });
  });
  
  app.post('/api/signin', function(req, res) {
    db.User.findOne({
        where: {
            Username: req.params.Username
          },
    }, function(err, user) {
      if (err) throw err;
      if (!user) {
        res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
      } else {
        // check if password matches
        user.comparePassword(req.body.Password, function (err, isMatch) {
          if (isMatch && !err) {
            // if user is found and password is right create a token
            var token = jwt.sign(user.toJSON(), config.secret);
            // return the information including token as JSON
            res.json({success: true, token: 'JWT ' + token});
          } else {
            res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
          }
        });
      }
    });
  });
  
  

};
// Requiring our models
const db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all service
  app.get("/api/services", function(req, res) {
    db.Service.findAll({
        include: [db.Franchise],
    }).then(function(x) {
      res.json(x);
    });
  });
  
  // GET route for retrieving a single service
  app.get("/api/services/:id", function(req, res) {
    db.Service.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Franchise],
    }).then(function(x) {
      res.json(x);
    });
  });

 // PUT route for updating services
 app.put("/api/services/:id", function(req, res) {
    db.Franchise.update({
        Name: req.body.Name,
        Description: req.body.Description,
        Rate: req.body.Rate
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

  // POST route for saving a new service
  app.post("/api/services", function(req, res) {
    db.Service.create(req.body).then(function(dbBath) {
      res.json(x);
    });
  });

  // DELETE route for deleting a service
  app.delete("/api/services/:id", function(req, res) {
    db.Service.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(x) {
      res.json(x);
    });
  });
  
 

};
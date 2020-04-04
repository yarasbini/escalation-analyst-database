// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id
    });
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function(req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(function() {
        res.redirect(307, "/api/login");
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });
  // GET route for getting all of the cases
  app.get("/api/case", function(req, res) {
    db.Case.findAll({}).then(function(dbresult) {
      res.json(dbresult);
    });
  });

  // POST route for saving a new case. You can create a case using the data on req.body
  app.post("/api/case", function(req, res) {
    console.log(req.body);
    const {
      //issueNumber,
      requestor,
      clientName,
      financialImpact,
      submitDate,
      escalationAnalyst,
      resolveDate
    } = req.body;
    db.Case.create({
      issueNumber,
      requestor,
      clientName,
      financialImpact,
      submitDate,
      escalationAnalyst,
      resolveDate
    }).then(function(dbCase) {
      res.json(dbCase);
    });
  });

  // // PUT route for updating cases
  // app.put("/api/case", function(req, res) {
  //   console.log(req.body);
  //   const { issueDescription, issueStatus } = req.body;
  //   db.Case.update({
  //     issueDescription,
  //     issueStatus
  //   }).then(function(dbCase) {
  //     res.json(dbCase);
  //   });
  // });

  app.delete("api/case/:id", function(req, res) {
    db.Case.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbCase) {
      res.json(dbCase);
    });
  });

  // this is the put route for updating cases
  app.put("/api/case", function(req, res) {
    const {
      issueNumber,
      requestor,
      clientName,
      financialImpact,
      submitDate,
      escalationAnalyst,
      resolveDate
    } = req.body;

    db.Case.updated(
      {
        issueNumber,
        requestor,
        clientName,
        financialImpact,
        submitDate,
        escalationAnalyst,
        resolveDate
      },
      {
        where: {
          id: req.body.id
        }
      }.then(function(dbCase) {
        res.json(dbCase);
      })
    );
  });
};

module.exports = function(app, passport) {
  var express = require('express');
  var router = express.Router();

  router.get('/estrutura/:id', app.isLoggedIn, function(req, res) {
    res.render("estrutura", { id : req.params['id'] });
  });

  return router;
}

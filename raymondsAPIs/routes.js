'use strict';
module.exports = function(app) {
  var todoList = require('./controller');
  var bodyParser = require('body-parser');
  var methodOverride = require('method-override');

var express = require('express')

  app.use(bodyParser.json());
  app.use(methodOverride('_method'));
  app.set('view engine', 'ejs');
  // todoList Routes
  app.route("/")
    .get(todoList.showhome);
  app.route("/findgym")
    .post(todoList.findgym);
}


  

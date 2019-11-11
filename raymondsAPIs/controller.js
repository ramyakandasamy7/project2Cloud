'use strict';
var express = require('express')


exports.showhome =  function(req,res) {
      res.render('index');
  }
exports.findgym = function(req, res) {
    console.log(req.body.location);
    res.render('map', {'location':req.body.location})
}
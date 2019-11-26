'use strict';
var express = require('express')
var aws = require("aws-sdk");
aws.config.update({
    region: "us-east-1",
    endpoint: "http://dynamodb.us-east-1.amazonaws.com"
  });
  var docClient = new aws.DynamoDB.DocumentClient();


exports.showhome =  function(req,res) {
      res.render('index');
  }
exports.showinfo = function(req, res) {
    var requests = [];
    var ratingsNumber = 0;
    var numRatings = 0;
    var gymRating = 0;
    var temp = 0;
    var params = {
        TableName: "gymDatabase",
        KeyConditionExpression: "#gymID = :gymid",
        ExpressionAttributeNames: {
            "#gymID": "gymID"
        },
        ExpressionAttributeValues: {
            ":gymid": req.params.id
            }
      };
      var ratings = {
        TableName: "ratingDatabase",  
        FilterExpression : 'gymID = :gymid',
        ExpressionAttributeValues: {
            ":gymid": req.params.id
            }
      };
      docClient.scan(ratings, (err,data) =>{
        if(err) console.log(err)
        else {
      data.Items.forEach(function(item) {
        numRatings = numRatings + 1;
        ratingsNumber = ratingsNumber + item.rating;
      });
      if(numRatings == 0) {
        gymRating = 0
      }
      else {
        gymRating = ratingsNumber/numRatings;
      }
      }
    });
      docClient.query(params, (err, data) => {
          if(err) console.log(err)
          else {
        data.Items.forEach(function(item) {
          requests.push(item);
          temp = item;
        });
        res.render('gyminfo', {gyminfo: requests, rating: gymRating, newinfo: temp});
    }
      });
}
exports.findgym = function(req, res) {
    var requests = [];
    var params = {
        TableName: "gymDatabase"
      };
      docClient.scan(params, (err, data) => {
        data.Items.forEach(function(item) {
          requests.push(item);
        });
        res.render('map', {'location':req.body.location, 'gyminfo': requests})
      });
}
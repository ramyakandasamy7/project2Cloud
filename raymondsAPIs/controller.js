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
  aws.config.update({
    region: "us-west",
    endpoint: "https://s3.amazonaws.com"
  });
  const s3 = new aws.S3({ apiVersion: "2006-03-1" });
  var params = {
    Bucket: "ramyakandasamy",
    Key: req.params.id + "/gym.jpg"
  };
  const url =
    "http://d2s1oz7w0n6e15.cloudfront.net/" + req.params.id + "/gym.jpg";
  //res.status(200);
  //res.json(url);

  
    var requests = [];
    var ratingsNumber = 0;
    var numRatings = 0;
    var gymRating = 0;
    var temp = 0;
    params = {
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
      docClient.query(params, (err, data) => {
        if(err) console.log(err)
        else {
      data.Items.forEach(function(item) {
        requests.push(item);
        temp = item;
      });
      var owners = {
        TableName: "ownerDatabase",  
        FilterExpression : 'ownerID = :id',
        ExpressionAttributeValues: {
            ":id": requests[0].gymOwner
            }
      };
      docClient.scan(owners, (err,data) =>{
        if(err) console.log(err)
        else {
          console.log(requests[0].gymOwner)
      data.Items.forEach(function(item) {
        res.render('gyminfo', {image: url, gyminfo: requests, rating: gymRating, owner: item.username, newinfo: temp});
      });
      
  }
    });
      }
    });
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
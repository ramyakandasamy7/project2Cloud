const request = require("express");
const requestRouter = request.Router();
const aws = require("aws-sdk");
var requests = new Array();
aws.config.update({
  region: "us-east-1",
  endpoint: "http://dynamodb.us-east-1.amazonaws.com"
});
var docClient = new aws.DynamoDB.DocumentClient();
const bodyParser = require("body-Parser");
requestRouter.use(bodyParser.json());
requestRouter.use(bodyParser.urlencoded({ extended: false }));

//create a request
requestRouter.post("/createrequest", (req, res) => {
  var ID = Math.random()
    .toString(36)
    .substr(2, 9);
  console.log("in requestRouter");
  var paramsaddRequest = {
    TableName: "requestDatabase",
    Item: {
      requestID: ID,
      dateRequest: req.body.date,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      userID: req.body.userID,
      gymID: req.body.gymID
    }
  };
  docClient.put(paramsaddRequest, function(err, data) {
    if (err) {
      console.log("Unable to add item" + JSON.stringify(err));
    } else {
      console.log("Added item", JSON.stringify(data, null, 2));
    }
  });
});
//delete request to workout
requestRouter.post("/deleterequest", (req, res) => {
  var params = {
    TableName: "requestDatabase",
    Key: {
      requestID: req.body.requestID
    }
  };
  docClient.delete(params, (err, data) => {
    if (err) {
      console.log("unable to delete item");
    } else {
      console.log("Delete Item succeeded");
    }
  });
});
//get requests
requestRouter.get("/requests", (req, res) => {
  var params = {
    TableName: "requestDatabase"
  };
  docClient.scan(params, (err, data) => {
    data.Items.forEach(function(item) {
      console.log(item);
      requests.push(item);
    });
    res.send(requests);
  });
});

//modify request to workout
requestRouter.post("/modifyrequest", (req, res) => {
  var params = {
    TableName: "requestDatabase",
    Key: {
      requestID: req.params.requestID
    },
    UpdateExpression: "set dateRequest =:x, startTime =:y, endTime=:z",
    ExpressionAttributeValues: {
      ":x": req.body.date,
      ":y": req.body.startTime,
      ":z": req.body.endTime
    },
    ReturnValues: "UPDATED_NEW"
  };
  docClient.update(params, function(err, data) {
    if (err) {
      console.error("unable to update item", err);
    } else {
      console.log("success");
    }
  });
});
module.exports = requestRouter;

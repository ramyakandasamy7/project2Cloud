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
  var paramsaddRequest = {
    TableName: "requestDatabase",
    Item: {
      requestID: ID,
      dateRequest: req.body.date,
      userID: req.body.userID,
      gymID: req.body.gymID,
      status: "Pending"
    }
  };
  docClient.put(paramsaddRequest, function(err, data) {
    if (err) {
      return res.status(400).json({
        message: "unable to add request to database " + err
      });
    } else {
      return res
        .status(200)
        .json({ message: requestID + "successfully added to database" });
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
      return res.status(400).json({
        error:
          "unable to delete request " + req.body.requestID + " error is:" + err
      });
    } else {
      return res
        .status(200)
        .json({ message: req.body.requestID + "request deleted" });
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
requestRouter.post("/modifyrequeststatus", (req, res) => {
  var params = {
    TableName: "requestDatabase",
    Key: {
      requestID: req.params.requestID
    },
    UpdateExpression:
      "set dateRequest =:x, startTime =:y, endTime=:z status=:y",
    ExpressionAttributeValues: {
      ":x": req.body.date,
      ":y": req.body.startTime,
      ":z": req.body.endTime,
      ":y": req.body.status
    },
    ReturnValues: "UPDATED_NEW"
  };
  docClient.update(params, function(err, data) {
    if (err) {
      return res.status(400).json({
        message:
          "unable to modify request " + req.body.requestID + " error is: " + err
      });
    } else {
      return res
        .status(200)
        .json({ message: req.body.requestID + "updated to" + data });
    }
  });
});
module.exports = requestRouter;

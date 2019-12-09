const request = require("express");
const requestRouter = request.Router();
const aws = require("aws-sdk");
var requests = new Array();
const bodyParser = require("body-parser");
requestRouter.use(bodyParser.json());
requestRouter.use(bodyParser.urlencoded({ extended: false }));
aws.config.update({
  region: "us-east-1",
  endpoint: "http://dynamodb.us-east-1.amazonaws.com"
});
var docClient = new aws.DynamoDB.DocumentClient();
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
      ownerID: req.body.ownerID,
      status: "Pending"
    }
  };
  docClient.put(paramsaddRequest, function(err, data) {
    if (err) {
      return res.status(400).json({
        message: "unable to add request to database " + err
      });
    } else {
      return res.status(200).json({
        message: ID + "request successfully added to database"
      });
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

requestRouter.get("/requests/:ownerID", (req, res) => {
  console.log(req.params);
  var params = {
    TableName: "requestDatabase",
    IndexName: "ownerID-index",
    KeyConditionExpression: "ownerID = :g",
    ExpressionAttributeValues: {
      ":g": req.params.ownerID
    }
  };
  docClient.query(params, function(err, data) {
    if (err) {
      //res.status(400);
      res.send(err);
      console.log(err);
    } else {
      console.log(data);
      res.status(200);
      res.json(data);
    }
  });
});

requestRouter.get("/request/:userID", (req, res) => {
  console.log(req.params);
  var params = {
    TableName: "requestDatabase",
    IndexName: "userID-index",
    KeyConditionExpression: "userID = :g",
    ExpressionAttributeValues: {
      ":g": req.params.userID
    }
  };
  docClient.query(params, function(err, data) {
    if (err) {
      //res.status(400);
      res.send(err);
      console.log(err);
    } else {
      console.log(data);
      res.status(200);
      res.json(data);
    }
  });
});

//modify request  status
requestRouter.post("/modifyrequeststatus", (req, res) => {
  var params = {
    TableName: "requestDatabase",
    Key: {
      requestID: req.body.requestID
    },
    UpdateExpression: "set #status=:y",
    ExpressionAttributeValues: {
      ":y": req.body.status
    },
    ExpressionAttributeNames: {
      "#status": "status"
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

/**modify day to workout */
/*requestRouter.post("/modifyday", (req, res) => {
  var params = {
    TableName: "requestDatabase",
    Key: {
      requestID: req.params.requestID
    },
    UpdateExpression: "date=:x, status:=y",
    ExpressionAttributeValues: {
      ":x": req.body.date,
      ":y": "Pending"
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
});*/
module.exports = requestRouter;

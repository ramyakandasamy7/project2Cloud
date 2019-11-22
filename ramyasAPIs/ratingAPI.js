const request = require("express");
const ratingRouter = request.Router();
const aws = require("aws-sdk");
const bodyParser = require("body-Parser");
ratingRouter.use(bodyParser.json());
ratingRouter.use(bodyParser.urlencoded({ extended: false }));
aws.config.update({
  region: "us-east-1",
  endpoint: "http://dynamodb.us-east-1.amazonaws.com"
});
var docClient = new aws.DynamoDB.DocumentClient();

ratingRouter.post("/createrating", (req, res) => {
  var ID = Math.random()
    .toString(36)
    .substr(2, 9);
  var paramsaddRating = {
    TableName: "ratingDatabase",
    Item: {
      ratingID: ID,
      rating: req.body.rating,
      gymID: req.body.gymID,
      userID: req.body.userID
    }
  };
  docClient.put(paramsaddRating, function(err, data) {
    if (err) {
      return res.status(400).json({ message: "unable to add request" + err });
    } else {
      return res
        .status(200)
        .json({ message: ID + "added to request database" });
    }
  });
});

ratingRouter.post("/deleterating", (req, res) => {
  aws.config.update({
    region: "us-east-1",
    endpoint: "http://dynamodb.us-east-1.amazonaws.com"
  });
  var params = {
    TableName: "requestDatabase",
    Key: {
      requestID: req.body.requestID
    }
  };
  docClient.delete(params, (err, data) => {
    if (err) {
      return res.status(400).json({
        error: "unable to delete gym " + req.body.requestID + " error is:" + err
      });
    } else {
      return res
        .status(200)
        .json({ message: req.body.requestID + " request deleted" });
    }
  });
});
module.exports = ratingRouter;

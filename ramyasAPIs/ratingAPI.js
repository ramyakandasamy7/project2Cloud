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
      console.log("Unable to add item" + JSON.stringify(err));
    } else {
      console.log("Added item", JSON.stringify(data, null, 2));
    }
  });
});
module.exports = ratingRouter;

const user = require("express");
const userRouter = user.Router();
const aws = require("aws-sdk");
aws.config.update({
  region: "us-east-1",
  endpoint: "http://dynamodb.us-east-1.amazonaws.com"
});
var docClient = new aws.DynamoDB.DocumentClient();
userRouter.post(
  "/createnewUser/:firstName/:lastName/:emailAddress/:paymentInformation/:location/:password",
  (req, res) => {
    var ID = Math.random()
      .toString(36)
      .substr(2, 9);
    var paramsaddUser = {
      TableName: "userDatabase",
      userID: ID,
      Name: req.params.firstName + " " + req.params.lastName,
      username: req.params.emailAddress,
      paymentInformation: req.params.paymentInformation,
      password: req.params.password,
      location: req.params.location,
      requests: {}
    };
    docClient.put(paramsaddUser, function(err, data) {
      if (err) {
        console.log("Unable to add item" + JSON.stringify(err));
      } else {
        console.log("userCreated");
      }
    });
  }
);

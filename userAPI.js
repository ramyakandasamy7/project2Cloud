const user = require("express");
const userRouter = user.Router();
const aws = require("aws-sdk");
aws.config.update({
  region: "us-east-1",
  endpoint: "http://dynamodb.us-east-1.amazonaws.com"
});
var docClient = new aws.DynamoDB.DocumentClient();

//create new user
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

//modify user
//delete user
//get user
userRouter.get("/users", (req, res) => {
  var params = {
    TableName: "userDatabase"
  };
  docClient.scan(params, (err, data) => {
    data.Items.forEach(function(item) {
      console.log(item);
      owners.push(item);
    });
    res.send(owners);
  });
});

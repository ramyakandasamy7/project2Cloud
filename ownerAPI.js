const owner = require("express");
const ownerRouter = owner.Router();
const aws = require("aws-sdk");
const s3 = new aws.S3({ apiVersion: "2006-03-1" });
aws.config.update({
  region: "us-east-1",
  endpoint: "http://dynamodb.us-east-1.amazonaws.com"
});
var docClient = new aws.DynamoDB.DocumentClient();
//ownerAPI
var owners = new Array();

//create an Owner
ownerRouter.post(
  "/createnewOwner/:firstName/:lastName/:emailAddress/:phoneNumber/:physicalAddress",
  (req, res) => {
    aws.config.update({
      region: "us-east-1",
      endpoint: "http://dynamodb.us-east-1.amazonaws.com"
    });
    var ID = Math.random()
      .toString(36)
      .substr(2, 9);
    var paramsaddOwner = {
      TableName: "ownerDatabase",
      Item: {
        ownerID: ID,
        Name: req.params.firstName + " " + req.params.lastName,
        emailAddress: req.params.emailAddress,
        phoneNumber: req.params.phoneNumber,
        physicalAddress: req.params.physicalAddress
      }
    };
    docClient.put(paramsaddOwner, function(err, data) {
      if (err) {
        console.log("Unable to add item" + JSON.stringify(err));
      } else {
        console.log("Added item", JSON.stringify(data, null, 2));
        aws.config.update({
          region: "us-east",
          endpoint: "https://s3.amazonaws.com"
        });
        //name folder the id of the owner and pictures should be easier to parse
        var bucketParams = {
          Bucket: "ramyakandasamy",
          Key: ID + "/",
          ACL: "public-read"
        };
        s3.putObject(bucketParams, function(err, data) {
          if (err) {
            console.log("Error creating the folder", err);
          } else {
            console.log("Successfully created a folder");
          }
        });
      }
    });
  }
);

//modify an Owner
//delete an Owner

//get all Owners
ownerRouter.get("/owners", (req, res) => {
  var params = {
    TableName: "ownerDatabase"
  };
  docClient.scan(params, (err, data) => {
    data.Items.forEach(function(item) {
      console.log(item);
      owners.push(item);
    });
    res.send(owners);
  });
});

module.exports = ownerRouter;

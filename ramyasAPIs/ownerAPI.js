const owner = require("express");
const ownerRouter = owner.Router();
const aws = require("aws-sdk");
const nodemailer = require("nodemailer");
const s3 = new aws.S3({ apiVersion: "2006-03-1" });
aws.config.update({
  region: "us-east-1",
  endpoint: "http://dynamodb.us-east-1.amazonaws.com"
});
var docClient = new aws.DynamoDB.DocumentClient();
//ownerAPI
var owners = new Array();
var smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "INSERT",
    pass: "INERST!"
  }
});
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
        isVerified: false,
        emailAddress: req.params.emailAddress,
        phoneNumber: req.params.phoneNumber,
        physicalAddress: req.params.physicalAddress
      }
    };
    var link = "http://localhost:3000" + "/verify?id=" + ID;
    mailOptions = {
      to: req.params.emailAddress,
      subject: "Please confirm your email address",
      html:
        "Hello,<br> Please Click on the link to verify your email.<br><a href=" +
        link +
        ">Click here to verify</a>"
    };
    docClient.put(paramsaddOwner, function(err, data) {
      if (err) {
        console.log("Unable to add item" + JSON.stringify(err));
      } else {
        console.log("Added item", JSON.stringify(data, null, 2));
        smtpTransport.sendMail(mailOptions, (err, response) => {
          if (err) {
            console.log(err);
          } else {
            console.log("message sent" + response.message);
          }
        });
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

ownerRouter.get("/verify", function(req, res) {
  console.log(req.protocol + ":/" + req.get("host"));
  if (req.protocol + "://" + req.get("host") == "http://" + "localhost:3000") {
    console.log(
      "Domain is matched. Information is from Authentic email" +
        JSON.stringify(req.query)
    );
    var idParams = {
      TableName: "ownerDatabase",
      KeyConditionExpression: "#ownerID =:ownerID",
      ExpressionAttributeNames: {
        "#ownerID": "ownerID"
      },
      ExpressionAttributeValues: {
        ":ownerID": req.query.id
      }
    };
    docClient.query(idParams, function(err, data) {
      if (err) {
        console.log(err);
      } else {
        data.Items.forEach(function(item) {
          if (item.userID == req.query.id) {
            console.log("user exists");
            console.log("email is verified");
            var params = {
              TableName: "ownerDatabase",
              Key: {
                ownerID: req.query.id
              },
              UpdateExpression: "set isVerified =:y",
              ExpressionAttributeValues: {
                ":y": true
              },
              ReturnValues: "UPDATED_NEW"
            };
            docClient.update(params, function(err, data) {
              if (err) {
                console.log(err);
              } else {
                console.log("Successfully verified!");
              }
            });

            res.end(
              "<h1>Email " + mailOptions.to + " is been Successfully verified"
            );
          }
        });
      }
    });
  } else {
    console.log("bad request");
  }
});

ownerRouter.post("/login/:emailaddress/:password", function(req, res) {
  var idParams = {
    TableName: "ownerDatabase"
  };
  docClient.scan(idParams, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      data.Items.forEach(function(item) {
        if (
          item.username == req.params.emailaddress &&
          item.password == req.params.password &&
          item.isVerified == true
        ) {
          console.log("you have successfully logged in!");
        } else {
          console.log("there is an error in your login screen");
        }
      });
    }
  });
});
//modify an Owner
ownerRouter.post(
  "/modifyOwner/:ownerID/:firstName/:lastName/:emailAddress/:phoneNumber/:physicalAddress",
  (req, res) => {
    var params = {
      TableName: "ownerDatabase",
      Key: {
        ownerID: req.params.ownerID
      },
      UpdateExpression:
        "set firstName =:x, lastName =:y, emailAddress=:z, phoneNumber=:a, physicalAddress=:b",
      ExpressionAttributeValues: {
        ":x": req.params.firstName,
        ":y": req.params.lastName,
        ":z": req.params.emailAddress,
        ":a": req.params.phoneNumber,
        ":b": req.params.physicalAddress
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
  }
);

//delete an Owner
ownerRouter.post("/deleteOwner/:ownerID", (req, res) => {
  var params = {
    TableName: "ownerDatabase",
    Key: {
      requestID: req.params.ownerID
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

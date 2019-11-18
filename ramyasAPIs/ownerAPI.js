const owner = require("express");
const ownerRouter = owner.Router();
const aws = require("aws-sdk");
const nodemailer = require("nodemailer");
const bodyParser = require("body-Parser");
const s3 = new aws.S3({ apiVersion: "2006-03-1" });
aws.config.update({
  region: "us-east-1",
  endpoint: "http://dynamodb.us-east-1.amazonaws.com"
});
var docClient = new aws.DynamoDB.DocumentClient();
//ownerAPI
var owners = new Array();
ownerRouter.use(bodyParser.json());
ownerRouter.use(bodyParser.urlencoded({ extended: false }));
var smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "ramyakandasamy7@gmail.com",
    pass: "Bluem85!"
  }
});
var mailOptions;
//create an Owner
//first name, last name, phone number
//email address
//password
ownerRouter.post(
  "/createnewOwner", //:firstName/:lastName/:emailAddress/:phoneNumber/:password",
  (req, res) => {
    aws.config.update({
      region: "us-east-1",
      endpoint: "http://dynamodb.us-east-1.amazonaws.com"
    });
    console.log("create new owner" + JSON.stringify(req.body));
    var ID = Math.random()
      .toString(36)
      .substr(2, 9);
    var paramsaddOwner = {
      TableName: "ownerDatabase",
      Item: {
        ownerID: ID,
        isVerified: false,
        //Name: req.params.firstName + " " + req.params.lastName,
        username: req.body.register_email,
        //paymentInformation: req.params.paymentInformation,
        password: req.body.register_password,
        location: req.body.register_location
        //emailAddress: req.body.register_email
        //phoneNumber: req.params.phoneNumber,
      }
    };
    var link = "http://localhost:3000" + "/verifyOwner?id=" + ID;
    var email = req.body.register_email;
    mailOptions = {
      to: email,
      subject: "Please confirm your email address",
      html:
        "Hello,<br> Thank you for deciding to be an owner on our service. Please Click on the link to verify your email.<br><a href=" +
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
          region: "us-west",
          endpoint: "https://s3.amazonaws.com"
        });
        //name folder the id of the owner and pictures should be easier to parse
      }
    });
  }
);
//verify email address
ownerRouter.get("/verifyOwner", function(req, res) {
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
          if (item.ownerID == req.query.id) {
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
          } else {
            console.log(
              "item.userID is" + item.ownerID + "req.userID is" + req.userID
            );
          }
        });
      }
    });
  } else {
    console.log("bad request");
  }
});

ownerRouter.post("/loginOwner", function(req, res) {
  var idParams = {
    TableName: "ownerDatabase"
  };
  docClient.scan(idParams, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      data.Items.forEach(function(item) {
        if (
          item.username == req.body.username &&
          item.password == req.body.password &&
          item.isVerified == true
        ) {
          console.log("you have successfully logged in!");
        } else {
          console.log("there is an error in your login screen");
          console.log(req.body.email);
          console.log(req.body.password);
        }
      });
    }
  });
});
//modify an Owner
ownerRouter.post("/modifyOwner", (req, res) => {
  var params = {
    TableName: "ownerDatabase",
    Key: {
      ownerID: req.body.ownerID
    },
    UpdateExpression:
      "set firstName =:x, lastName =:y, emailAddress=:z, phoneNumber=:a, physicalAddress=:b",
    ExpressionAttributeValues: {
      ":x": req.body.firstName,
      ":y": req.body.lastName,
      ":z": req.body.emailAddress,
      ":a": req.body.phoneNumber,
      ":b": req.body.physicalAddress
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

//delete an Owner
ownerRouter.post("/deleteOwner", (req, res) => {
  var params = {
    TableName: "ownerDatabase",
    Key: {
      requestID: req.body.ownerID
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

const user = require("express");
const userRouter = user.Router();
const aws = require("aws-sdk");
const nodemailer = require("nodemailer");
aws.config.update({
  region: "us-east-1",
  endpoint: "http://dynamodb.us-east-1.amazonaws.com"
});
var docClient = new aws.DynamoDB.DocumentClient();
var smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "INSERT",
    pass: "INSERT"
  }
});
//create new user

userRouter.post(
  "/createnewUser/:firstName/:lastName/:emailAddress/:paymentInformation/:location/:password",
  (req, res) => {
    console.log("Here");
    var ID = Math.random()
      .toString(36)
      .substr(2, 9);
    console.log(ID);
    var paramsaddUser = {
      TableName: "userDatabase",
      Item: {
        userID: ID,
        isVerified: false,
        Name: req.params.firstName + " " + req.params.lastName,
        username: req.params.emailAddress,
        paymentInformation: req.params.paymentInformation,
        password: req.params.password,
        location: req.params.location,
        requests: {}
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

    docClient.put(paramsaddUser, function(err, data) {
      if (err) {
        console.log("Unable to add item" + err);
      } else {
        console.log("userCreated");
        smtpTransport.sendMail(mailOptions, (err, response) => {
          if (err) {
            console.log(err);
          } else {
            console.log("message sent" + response.message);
          }
        });
      }
    });
  }
);

//requires verification of new User
userRouter.get("/verify", function(req, res) {
  console.log(req.protocol + ":/" + req.get("host"));
  if (req.protocol + "://" + req.get("host") == "http://" + "localhost:3000") {
    console.log(
      "Domain is matched. Information is from Authentic email" +
        JSON.stringify(req.query)
    );
    var idParams = {
      TableName: "userDatabase",
      KeyConditionExpression: "#userID =:userID",
      ExpressionAttributeNames: {
        "#userID": "userID"
      },
      ExpressionAttributeValues: {
        ":userID": req.query.id
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
              TableName: "userDatabase",
              Key: {
                userID: req.query.id
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

//login if valid
userRouter.post("/login/:emailaddress/:password", function(req, res) {
  var idParams = {
    TableName: "userDatabase"
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
//modify user
userRouter.post(
  "/modifyUser/:userID/:firstName/:lastName/:emailAddress/:paymentInformation/:location/:password",
  (req, res) => {
    var params = {
      TableName: "userDatabase",
      Key: {
        userID: req.params.userID
      },
      UpdateExpression:
        "set firstName =:x, lastName =:y, emailAddress=:z, paymentInformation=:a, location=:b, password=:c",
      ExpressionAttributeValues: {
        ":x": req.params.firstName,
        ":y": req.params.lastName,
        ":z": req.params.emailAddress,
        ":a": req.params.paymentInformation,
        ":b": req.params.location,
        ":c": req.params.password
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

//delete user
userRouter.post("/deleteUser/:userID", (req, res) => {
  var params = {
    TableName: "userDatabase",
    Key: {
      userID: req.params.userID
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
module.exports = userRouter;

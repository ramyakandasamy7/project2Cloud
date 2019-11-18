const user = require("express");
const userRouter = user.Router();
const aws = require("aws-sdk");
const bodyParser = require("body-Parser");

const nodemailer = require("nodemailer");
aws.config.update({
  region: "us-east-1",
  endpoint: "http://dynamodb.us-east-1.amazonaws.com"
});
var docClient = new aws.DynamoDB.DocumentClient();
var smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "ramyakandasamy7@gmail.com",
    pass: "Bluem85!"
  }
});
//create new user
userRouter.use(bodyParser.json());
userRouter.use(bodyParser.urlencoded({ extended: false }));
userRouter.post(
  "/createnewUser", ///:firstName/:lastName/:emailAddress/:paymentInformation/:location/:password",
  (req, res) => {
    var ID = Math.random()
      .toString(36)
      .substr(2, 9);
    console.log(ID);
    console.log(JSON.stringify(req.body));
    var paramsaddUser = {
      TableName: "userDatabase",
      Item: {
        userID: ID,
        isVerified: false,
        //Name: req.params.firstName + " " + req.params.lastName,
        username: req.body.register_email,
        //paymentInformation: req.params.paymentInformation,
        password: req.body.register_password,
        location: req.body.register_location
      }
    };
    var link = "http://localhost:3000" + "/verifyUser?id=" + ID;
    mailOptions = {
      to: req.body.register_email,
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
userRouter.get("/verifyUser", function(req, res) {
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
userRouter.post("/loginUser", function(req, res) {
  var idParams = {
    TableName: "userDatabase"
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
        ":x": req.body.firstName,
        ":y": req.body.lastName,
        ":z": req.body.emailAddress,
        ":a": req.body.paymentInformation,
        ":b": req.body.location,
        ":c": req.bo.password
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
userRouter.post("/deleteUser", (req, res) => {
  var params = {
    TableName: "userDatabase",
    Key: {
      userID: req.body.userID
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

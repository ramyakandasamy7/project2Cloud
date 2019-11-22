const user = require("express");
const userRouter = user.Router();
const aws = require("aws-sdk");
const bodyParser = require("body-parser");
var users = new Array();
const nodemailer = require("nodemailer");
userRouter.use(bodyParser.json());
userRouter.use(bodyParser.urlencoded({ extended: false }));
aws.config.update({
  region: "us-east-1",
  endpoint: "http://dynamodb.us-east-1.amazonaws.com"
});
var docClient = new aws.DynamoDB.DocumentClient();
var smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "garagegymcloud@gmail.com",
    pass: "garagegym123!"
  }
});

/** method to create new user. First, it checks to see if the username already exists. If not, it will add the user to the database and send an email */

userRouter.post("/createnewUser", (req, res) => {
  let promise = new Promise(function(resolve, reject) {
    var idParams = {
      TableName: "userDatabase"
    };
    docClient.scan(idParams, function(err, data) {
      if (err) {
        reject("false");
      } else {
        data.Items.forEach(function(item) {
          if (item.username == req.body.register_email) {
            console.log("username exists!");
            resolve(true);
          }
        });
      }
      resolve(false);
    });
  });
  promise.then(function(message) {
    // if user already exists
    if (message == true) {
      return res
        .status(400)
        .json({ message: req.body.register_email + " already exists" });
    }
    if (message == false) {
      var ID = Math.random()
        .toString(36)
        .substr(2, 9);
      var paramsaddUser = {
        TableName: "userDatabase",
        Item: {
          userID: ID,
          isVerified: false,
          username: req.body.register_email,
          password: req.body.register_password,
          location: req.body.register_location
        }
      };
      var link = "http://localhost:3000" + "/verifyUser?id=" + ID;
      var emailAddress = req.body.register_email;
      mailOptions = {
        to: emailAddress,
        subject: "Please confirm your email address",
        html:
          "Hello,<br> Please Click on the link to verify your email.<br><a href=" +
          link +
          ">Click here to verify</a>"
      };
      //add new user into dynamoDB database; if successful, send the email
      docClient.put(paramsaddUser, function(err, data) {
        if (err) {
          res.status(400).json({ error: err });
        } else {
          smtpTransport.sendMail(mailOptions, (err, response) => {
            if (err) {
              return res.status(400).json({
                message:
                  emailAddress +
                  " has been added to database but email failed to send"
              });
            } else {
              return res.status(200).json({
                message:
                  emailAddress +
                  " has been added to the user database and email has been sent"
              });
            }
          });
        }
      });
    }
  });
});

//requires verification of new User
userRouter.get("/verifyUser", function(req, res) {
  console.log(req.protocol + ":/" + req.get("host"));
  if (req.protocol + "://" + req.get("host") == "http://" + "localhost:3000") {
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
        res.status(400).json({ error: err });
      } else {
        data.Items.forEach(function(item) {
          if (item.userID == req.query.id) {
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
                return res.status(400).json({ error: err });
              } else {
                return res.status(200).json({
                  message: emailAddress + " has been successfully verified!"
                });
              }
            });
          }
        });
      }
    });
  } else {
    return res.status(400).json({
      message:
        req.protocol +
        ":/" +
        req.get("host") +
        " is a invalid verification link"
    });
  }
});

//logs in users
userRouter.post("/loginUser", function(req, res) {
  let promise = new Promise(function(resolve, reject) {
    var idParams = {
      TableName: "userDatabase"
    };
    docClient.scan(idParams, function(err, data) {
      if (err) {
        reject("false");
      } else {
        data.Items.forEach(function(item) {
          if (
            item.username == req.body.username &&
            item.password == req.body.password &&
            item.isVerified == true
          ) {
            console.log(req.body.username);
            console.log(req.body.password);
            exists = true;
            resolve(true);
          }
        });
      }
      resolve(false);
    });
  });

  promise.then(function(message) {
    if (message == true) {
      return res
        .status(200)
        .json({ message: req.body.username + " is successful in logging in" });
    } else {
      return res.status(400).json({
        message:
          req.body.username +
          " or " +
          req.body.password +
          " does not exist or has not been verified"
      });
    }
  });
});
//modify user's password
userRouter.post("/modifypassword", (req, res) => {
  var params = {
    TableName: "userDatabase",
    Key: {
      userID: req.body.userID
    },
    UpdateExpression: "set password=:c",
    ExpressionAttributeValues: {
      ":c": req.body.password
    },
    ReturnValues: "UPDATED_NEW"
  };
  docClient.update(params, function(err, data) {
    if (err) {
      return res.status(400).json({ error: err });
    } else {
      return res
        .status(200)
        .json({ message: req.body.userID + " has been updated" });
    }
  });
});

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
      return res.status(400).json({ error: err });
    } else {
      return res
        .status(200)
        .json({ message: req.body.userID + "has been deleted" });
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
      users.push(item);
    });
    res.status(200).json(users);
  });
});
module.exports = userRouter;

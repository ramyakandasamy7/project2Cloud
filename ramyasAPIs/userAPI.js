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
    user: "INSERT",
    pass: "INSERT"
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
        res.json(404 + "error");
      } else {
        console.log(200 + " user created");
        smtpTransport.sendMail(mailOptions, (err, response) => {
          if (err) {
            res.json(400 + " error sending email");
          } else {
            res.json(200 + " email sent");
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
    res.json(200 + " Information is from an authentic email");
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
        res.json(400, "No user exists with that email address");
      } else {
        data.Items.forEach(function(item) {
          if (item.userID == req.query.id) {
            res.json(200 + " user exists in database");
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
                res.json(400 + "user is not verified");
              } else {
                res.json(200 + "user is successfully verified");
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
    res.json(400 + "link is invalid");
  }
});

//login if valid
userRouter.post("/loginUser", function(req, res) {
  var idParams = {
    TableName: "userDatabase"
  };
  docClient.scan(idParams, function(err, data) {
    if (err) {
      res.json(404 + " there was an issue on our database ");
    } else {
      data.Items.forEach(function(item) {
        if (
          item.username == req.body.username &&
          item.password == req.body.password &&
          item.isVerified == true
        ) {
          res.json(200 + " user has successfully logged in");
        } else {
          res.json(400 + " invalid credentials");
        }
      });
    }
  });
});
//modify user
userRouter.post("/modifyUser/", (req, res) => {
  var params = {
    TableName: "userDatabase",
    Key: {
      userID: req.body.userID
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
      res.json(400 + " unable to update user");
    } else {
      res.json(200 + " user successfully modified");
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
      res.json(400 + "user was not deleted");
    } else {
      res.json(200 + "user is successfully deleted");
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
    res.send(users);
  });
});
module.exports = userRouter;

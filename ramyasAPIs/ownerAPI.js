const owner = require("express");
const ownerRouter = owner.Router();
const aws = require("aws-sdk");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const s3 = new aws.S3({ apiVersion: "2006-03-1" });
aws.config.update({
  region: "us-east-1",
  endpoint: "http://dynamodb.us-east-1.amazonaws.com"
});
var docClient = new aws.DynamoDB.DocumentClient();
//ownerAPI

var smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "garagegymcloud@gmail.com",
    pass: "garagegym123!"
  }
});
var mailOptions;
ownerRouter.use(bodyParser.json());
ownerRouter.use(bodyParser.urlencoded({ extended: false }));

ownerRouter.post("/createnewOwner", (req, res) => {
  let promise = new Promise(function(resolve, reject) {
    var idParams = {
      TableName: "ownerDatabase"
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
      var paramsaddOwner = {
        TableName: "ownerDatabase",
        Item: {
          ownerID: ID,
          isVerified: false,
          username: req.body.register_email,
          password: req.body.register_password,
          location: req.body.register_location
        }
      };
      var link = "http://gg.mymsseprojects.com/owner_verification?id=" + ID;
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
      docClient.put(paramsaddOwner, function(err, data) {
        if (err) {
          res.status(400).json({ error: err });
        } else {
          smtpTransport.sendMail(mailOptions, (err, response) => {
            if (err) {
	      console.log(err);
              return res.status(400).json({
                message:
                  emailAddress +
                  " has been added to owner database but email failed to send"
              });
            } else {
              return res.status(200).json({
                message:
                  emailAddress +
                  " has been added to the owner database and email has been sent"
              });
            }
          });
        }
      });
    }
  });
});
/*ownerRouter.post(
  "/createnewOwner", //:firstName/:lastName/:emailAddress/:phoneNumber/:password",
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
        username: req.body.register_email,
        password: req.body.register_password,
        location: req.body.register_location
      }
    };
    var link = "http://localhost:3000" + "/verifyOwner?id=" + ID;
    var emailAddress = req.body.register_email;
    mailOptions = {
      to: emailAddress,
      subject: "Please confirm your email address",
      html:
        "Hello,<br> Thank you for deciding to be an owner on our service. Please Click on the link to verify your email.<br><a href=" +
        link +
        ">Click here to verify</a>"
    };
    docClient.put(paramsaddOwner, function(err, data) {
      if (err) {
      } else {
        smtpTransport.sendMail(mailOptions, (err, response) => {
          if (err) {
            res.status(400).json({ error: err });
          } else {
            res.status(200).json({
              email:
                emailAddress +
                " owner has been added to database and email has been sent"
            });
          }
        });
        aws.config.update({
          region: "us-west",
          endpoint: "https://s3.amazonaws.com"
        });
      }
    });
  }
);*/

//verify email address
ownerRouter.get("/verifyOwner", function(req, res) {
  console.log(req.protocol + "://" + req.get("host"));
  if (req.protocol + "://" + req.get("host") == "http://3.95.182.111:3000") {
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
        res.status(400).json({ error: err });
      } else {
        data.Items.forEach(function(item) {
          if (item.ownerID == req.query.id) {
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
                res.status(400).json({ error: err });
              } else {
                res.status(200).json({
                  message: "Ok"
                });
              }
            });
          }
        });
      }
    });
  } else {
    res.status(400).json({
      message:
        req.protocol +
        ":/" +
        req.get("host") +
        " is a invalid verification link"
    });
  }
});
/** method to login owners. Checks to see if owner username and password is in database */
ownerRouter.post("/loginOwner", function(req, res) {
  var u,i;
  let promise = new Promise(function(resolve, reject) {
    var idParams = {
      TableName: "ownerDatabase"
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
	    u = item.username;
	    i = item.ownerID;
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
      let data = {
	username : u,
	id: i
      };
      return res
        .status(200)
        .json({ message: req.body.username + "is successful in logging in", data: data });
    } else {
      return res.status(400).json({
        message:
          req.body.username + " or " + req.body.password + "does not exist"
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
      ":z": req.body.emailAddress,
      ":a": req.body.phoneNumber,
      ":b": req.body.physicalAddress
    },
    ReturnValues: "UPDATED_NEW"
  };
  docClient.update(params, function(err, data) {
    if (err) {
      res.status(400).json({ error: err });
    } else {
      res.status(200).json({ message: req.body.ownerID + " has been updated" });
    }
  });
});

//delete an Owner
ownerRouter.post("/deleteOwner", (req, res) => {
  var params = {
    TableName: "ownerDatabase",
    Key: {
      ownerID: req.body.ownerID
    }
  };
  docClient.delete(params, (err, data) => {
    if (err) {
      return res.status(400).json({ error: err });
    } else {
      return res
        .status(200)
        .json({ message: req.body.ownerID + "has been deleted" });
    }
  });
});

ownerRouter.get("/owners/:id", (req, res) => {
	console.log(req.params.id);
	var params = {
		TableName: "ownerDatabase",
		Key: {
			ownerID: req.params.id
		}
	};
	docClient.get(params, function(err, data) {
		if (err) {
			res.status(400);
			res.send(err);
		} else {
			console.log(data);
			res.status(200);
			res.json(data);
		}
	});
});

//get all Owners
ownerRouter.get("/owners", (req, res) => {
  var params = {
    TableName: "ownerDatabase"
  };
  var owners = [];
  docClient.scan(params, (err, data) => {
    data.Items.forEach(function(item) {
      console.log(item);
      owners.push(item);
    });
    res.send(owners);
  });
});

module.exports = ownerRouter;

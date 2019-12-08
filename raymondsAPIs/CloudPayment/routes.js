var stripe = require('stripe')("sk_test_pGzfGZYCpm99PYC8z0VBMIe300BTPuDuOw");
const nodemailer = require("nodemailer");
const aws = require("aws-sdk");
var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "garagegymcloud@gmail.com",
      pass: "garagegym123!"
    }
  });

  aws.config.update({
    region: "us-east-1",
    endpoint: "http://dynamodb.us-east-1.amazonaws.com"
  });
  var docClient = new aws.DynamoDB.DocumentClient();

exports.showhome = function(req, res) {
    console.log(req.body);
    var amount = req.body.chargeAmount;
    var ownerEmail = req.body.ownerEmail;
    var userEmail = req.body.userEmail;
    var gymLocation = req.body.gymLocation;
    var reserveDate = req.body.reserveDate;
    var userId = req.body.userID;
    var gymId = req.body.gymID;
    var ownerId = req.body.ownerId;
    res.render('home', {req: req.body, ownerId: ownerId, amount: amount, userId: userId, gymId: gymId, ownerEmail: ownerEmail, userEmail: userEmail, gymLocation: gymLocation, reserveDate: reserveDate });
}

exports.charge = function(req, res) {
    var token = req.body.stripeToken;
    var chargeAmount = req.body.chargeAmount;
    var ownerEmail = req.body.ownerEmail;
    var userEmail = req.body.userEmail;
    var gymLocation = req.body.gymLocation;
    var reserveDate = req.body.reserveDate;
    var ownerId = req.body.ownerId;
    console.log(chargeAmount);
    var mailOptions = {
        to: userEmail,
        subject: "Reservation for Gym Confirmation",
        html:"You have paid $" + chargeAmount/100 +" for the gym at " +  gymLocation + " on " + reserveDate
      };
    var ownerMailOptions = {
      to: ownerEmail,
      subject: "Reservation for Gym Confirmation",
      html: gymLocation + " has been reserved on " + reserveDate + " by " + userEmail
    }
    var charge = stripe.charges.create({
        'amount': chargeAmount,
        'currency': 'usd',
        'source': token
    }, function(err,charge) {
        if(err) res.send(err)
        else {
          smtpTransport.sendMail(mailOptions, (err, response) => {
            
          });
          smtpTransport.sendMail(ownerMailOptions, (err, response) => {

          });
          var ID = Math.random()
            .toString(36)
            .substr(2, 9);
          var paramsaddRequest = {
            TableName: "requestDatabase",
            Item: {
              requestID: ID,
              dateRequest: req.body.reserveDate,
              userID: req.body.userId,
              gymID: req.body.gymId,
	      ownerID: req.body.ownerId,
              status: "Pending"
            }
          };
          docClient.put(paramsaddRequest, function(err, data) {
            if (err) {
              /*return res.status(400).json({
                message: "unable to add request to database " + err
              });*/
            } else {
              /*return res.status(200).json({
                message: ID + "request successfully added to database"
              });*/
            }
          });
         res.redirect('http://gg.ramyaprojects.net');
        }
    })
}

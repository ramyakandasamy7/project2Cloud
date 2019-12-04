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
    /*var amount = req.body.amount;
    var owner_email = req.body.owner_email;
    var user_email = req.body.user_email;
    var location = req.body.location;
    var reserve_date = req.body.reserve_date*/
    var amount = 100;
    var owner_email = "horaymond6@gmail.com";
    var user_email = "horaymond6@gmail.com";
    var location = "San Jose, CA"
    var reserve_date = "01/01/2020";
    res.render('home', {amount: amount, owner_email: owner_email, user_email: user_email, location: location, reserve_date, reserve_date});
}

exports.charge = function(req, res) {
    var token = req.body.stripeToken;
    var chargeAmount = req.body.chargeAmount;
    var ownerEmail = req.body.ownerEmail;
    var userEmail = req.body.userEmail;
    var gymLocation = req.body.gymLocation;
    var reserveDate = req.body.reserveDate;
    console.log(chargeAmount);
    var mailOptions = {
        to: userEmail,
        subject: "Reservation for Gym Confirmation",
        html:"You have paid $" + chargeAmount/100 +" for the gym at " +  gymLocation + "on " + reserveDate
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
          var ID = Math.random()
            .toString(36)
            .substr(2, 9);
          var paramsaddRequest = {
            TableName: "requestDatabase",
            Item: {
              requestID: ID,
              dateRequest: req.body.reserve_date,
              userID: req.body.user_id,
              gymID: req.body.gym_id,
              status: "Pending"
            }
          };
          docClient.put(paramsaddRequest, function(err, data) {
            if (err) {
              return res.status(400).json({
                message: "unable to add request to database " + err
              });
            } else {
              return res.status(200).json({
                message: ID + "request successfully added to database"
              });
            }
          });
            smtpTransport.sendMail(mailOptions, (err, response) => {
            
            });
            smtpTransport.sendMail(ownerMailOptions, (err, response) => {

            });
         res.render('otherpage');
        }
    })
}
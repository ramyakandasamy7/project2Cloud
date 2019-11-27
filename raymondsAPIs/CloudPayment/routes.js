var stripe = require('stripe')("sk_test_pGzfGZYCpm99PYC8z0VBMIe300BTPuDuOw");
const nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "garagegymcloud@gmail.com",
      pass: "garagegym123!"
    }
  });

exports.showhome = function(req, res) {
    var gymprice = 200;
    res.render('home', {amount: 200});
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
            smtpTransport.sendMail(mailOptions, (err, response) => {
            
            });
            smtpTransport.sendMail(ownerMailOptions, (err, response) => {

            });
         res.render('otherpage');
        }
    })
}
var express = require('express');
var stripe = require('stripe')("sk_test_pGzfGZYCpm99PYC8z0VBMIe300BTPuDuOw");
var bodyParser = require('body-parser');
var routes = require('./routes');

var app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.route("/")
    .post(routes.showhome);  

/*app.route("/paysuccess")
    .get(routes.showsuccess);*/

app.route("/charge")
    .post(routes.charge);

app.listen(5000);

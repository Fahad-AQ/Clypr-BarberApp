var stripe = require('stripe')('stripeToken');
var express 	= require("express");
var path		= require("path");
var bodyParser = require("body-parser");
var app = express();

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
 });
 
app.set("port", process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Clypr - booking App Server !')
})

app.post('/payment', function (req, res) {
 var token = req.body.data.stripeToken; 
 var userEmail = req.body.data.userEmail;
 var styleAmount = req.body.data.styleAmount;

    var charge = stripe.charges.create({
        amount: styleAmount, // amount in cents, again
        currency: "usd",
        card: token,
        description: userEmail
    }, function(err, charge) {
        if (err && err.type === 'StripeCardError') {
            console.log(JSON.stringify(err, null, 2));
             res.send("Incorrect Card Information")
        }
        res.send("completed payment!")
    });
});

app.listen(app.get("port"),()=>{
    console.log("Server is running on port", app.get("port"))
}) 
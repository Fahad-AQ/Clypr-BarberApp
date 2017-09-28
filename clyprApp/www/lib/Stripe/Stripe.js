var stripe = require("stripe")("sk_test_rJLQl8m7PO7J3a8xuJfNwaYi");
stripe.makePayment = makePayment;

function makePayment(payment){
  stripe.charges.create({
  amount: payment.amount,
  currency: "usd",
  source: "src_18eYalAHEMiOZZp1l9ZTjSU0",
}, function(err, charge) {
  if(err){
    return err;
  }
  return charge;
});
}

module.exports = stripe;
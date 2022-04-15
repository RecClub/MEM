
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_KEY);
const cors = require('cors');
const express = require('express');
const app = express();

const CLIENT_DOMAIN = process.env.CLIENT_DOMAIN;

var corsOptions = {
  origin: CLIENT_DOMAIN,
}
app.use(cors(corsOptions));

app.post('/checkout', async (req, res) => {
  let price = "";

  if (req.query.price == '60') {
    if (req.query.discount == "true" && req.query.penalty == "false") {
      price = "price_1KofD3Ia56nMI1YLiXO6cozc";
      req.query.price = '54';
    } else if (req.query.discount == "false" && req.query.penalty == "true") {
      price = "price_1KofDfIa56nMI1YLWU7YGFan";
      req.query.price = '66';
    } else {
      price = "price_1KoFK3Ia56nMI1YLbgom6wg3";
    }
  } else {
    if (req.query.discount == "true" && req.query.penalty == "false") {
      price = "price_1KofEVIa56nMI1YLRmyx9UZO";
      req.query.price = '36';
    } else if (req.query.discount == "false" && req.query.penalty == "true") {
      price = "price_1KofFCIa56nMI1YLez8B9guA";
      req.query.price = '44';
    } else {
      price = "price_1KoFLWIa56nMI1YLqQgUxVrw";
    }
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: price,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${CLIENT_DOMAIN}/Member?success=true&userID=${req.query.userID}&classID=${req.query.classID}&price=${req.query.price}&penalty=${req.query.penalty}&discount=${req.query.discount}`,
    cancel_url: `${CLIENT_DOMAIN}/Member?canceled=true`,
  });
  
  res.json({checkoutURL: session.url});
});

app.listen(4242, () => console.log('Checkout server running on port 4242'));
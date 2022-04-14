
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
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: req.query.price == "60" ? 'price_1KoFK3Ia56nMI1YLbgom6wg3' : 'price_1KoFLWIa56nMI1YLqQgUxVrw',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${CLIENT_DOMAIN}/Member?success=true&userID=${req.query.userID}&classID=${req.query.classID}&price=${req.query.price}`,
    cancel_url: `${CLIENT_DOMAIN}/Member?canceled=true`,
  });
  
  res.json({checkoutURL: session.url});
});

app.listen(4242, () => console.log('Checkout server running on port 4242'));
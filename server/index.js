
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
        price: 'price_1KjqrJIa56nMI1YLB3ZP0BVQ',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${CLIENT_DOMAIN}/Member?success=true`,
    cancel_url: `${CLIENT_DOMAIN}/Member?canceled=true`,
  });
  
  res.json({checkoutURL: session.url});
});

app.listen(4242, () => console.log('Checkout server running on port 4242'));
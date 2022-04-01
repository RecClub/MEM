import React, {useState, useEffect} from 'react';

import Button from '@mui/material/Button';
import PaymentIcon from '@mui/icons-material/Payment';

import paymentServer from '../apis/paymentServer';

const Payment = () => {
  const [message, setMessage] = useState("");

  const handlePayment = () => {
    paymentServer.post('/checkout').then((response) => {
      window.location.href = response.data.checkoutURL; 
    });
  };

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, []);


  return (
    <div>
      <Button type="submit" variant="contained" color="primary" startIcon={<PaymentIcon />} onClick={handlePayment}>
        Pay Now
      </Button>
      {message}
    </div>
  );
};

export default Payment;

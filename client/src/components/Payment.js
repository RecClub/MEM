import React, { useState, useEffect, useContext } from 'react';

import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import PaymentIcon from '@mui/icons-material/Payment';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import paymentServer from '../apis/paymentServer';
import jsonDB from '../apis/jsonDB';
import userContext from '../contexts/UserContext';

const Payment = () => {
  const [message, setMessage] = useState('');
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedClass, setSelectedClass] = React.useState();
  const [classes, setClasses] = React.useState();

  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);

  const handleSelectionChange = (id) => {
    if (!id) return;
    console.log(id);
  };

  const handlePayment = () => {
    paymentServer.post('/checkout').then((response) => {
      window.location.href = response.data.checkoutURL;
    });
  };

  let { user } = useContext(userContext);
  useEffect(() => {
    if (!user || !('class' in user)) return;

    const fetchClasses = async () => {
      let promises = Object.entries(user.class).map(([id, paid]) => jsonDB.get(`/classes/${id}`));
      let values = await Promise.all(promises);
      setClasses(
        values.map((value) => {
          value.data.startDate = new Date(value.data.startDate).toLocaleString();
          value.data.paid = user.class[value.data.id] ? "Yes" : "No";
          return value.data;
        })
      );
    };

    fetchClasses();
  }, [user]);

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get('success')) {
      setMessage('Order placed! You will receive an email confirmation.');
    }

    if (query.get('canceled')) {
      setMessage("Order canceled -- continue to shop around and checkout when you're ready.");
    }
  }, []);

  let gridData = {
    columns: [
      { field: 'id', hide: true },
      { field: 'name', headerName: 'Name', width: "150" },
      { field: 'startDate', headerName: 'Start Date', width: "200" },
      { field: 'duration', headerName: 'Duration' },
      { field: 'paid', headerName: 'Paid' },
    ],
    rows: classes,
  };

  return (
    <div>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Message Sent'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Your message has been sent!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      <div style={{ display: 'flex', maxWidth: 800, minHeight: 300 }}>
        <DataGrid
          autoHeight
          components={{ Toolbar: GridToolbar }}
          onSelectionModelChange={handleSelectionChange}
          {...gridData}
        />
      </div>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        startIcon={<PaymentIcon />}
        onClick={handlePayment}
      >
        Pay Now
      </Button>
      {message}
    </div>
  );
};

export default Payment;

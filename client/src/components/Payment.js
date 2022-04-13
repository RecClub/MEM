import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const [messageTitle, setMessageTitle] = useState('');
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedClassID, setSelectedClassID] = React.useState();
  const [classes, setClasses] = React.useState([]);

  let navigate = useNavigate();
  let { user } = useContext(userContext);

  const fetchClasses = useCallback (async () => {
    if (!user) return;

    if (!('class' in user)) {
      setClasses([]);
      return;
    };

    let promises = Object.entries(user.class).map(([id, paid]) => jsonDB.get(`/classes/${id}`));
    let values = await Promise.all(promises);
    setClasses(
      values.map((value) => {
        value.data.startDate = new Date(value.data.startDate).toLocaleString();
        value.data.paid = user.class[value.data.id] ? "Yes" : "No";
        return value.data;
      })
    );
  }, [user]);

  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = async () => {
    setDialogOpen(false);
    navigate('/Member');
    window.location.reload(false);
  };

  const handleSelectionChange = (selected) => {
    if (!selected) return;
    setSelectedClassID(selected[0]);
  };

  const handlePayment = async () => {
    if (!user) return;
    let newUserInfo = await jsonDB.get(`users/${user.id}`);
    newUserInfo = newUserInfo.data;

    if ("class" in newUserInfo && !newUserInfo.class[selectedClassID]) {
      paymentServer.post(`/checkout?classID=${selectedClassID}&userID=${user.id}`).then((response) => {
        window.location.href = response.data.checkoutURL;
      });
    } else {
      setMessage("You have already paid for this class!");
      setMessageTitle("Payment Error");
      handleDialogOpen();
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [user, fetchClasses]);

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    const paymentSuccess = async () => {
      let user = await jsonDB.get(`users/${query.get('userID')}`)
      user = user.data;

      user.class[query.get('classID')] = true;
      await jsonDB.put(`users/${query.get('userID')}`, user);
      await fetchClasses();

      handleDialogOpen();
    };

    if (query.get('success')) {
      setMessage('Order placed! You will receive an email confirmation.');
      setMessageTitle("Payment Success");
      paymentSuccess();
    }

    if (query.get('canceled')) {
      setMessage("Order canceled -- continue to shop around and checkout when you're ready.");
      setMessageTitle("Payment Cancelled");
      handleDialogOpen();
    }
  }, [fetchClasses]);

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
        <DialogTitle id="alert-dialog-title">{messageTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
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
    </div>
  );
};

export default Payment;

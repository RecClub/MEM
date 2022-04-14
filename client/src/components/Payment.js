import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import PaymentIcon from '@mui/icons-material/Payment';
import TimeIcon from '@mui/icons-material/AccessTime';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

import paymentServer from '../apis/paymentServer';
import jsonDB from '../apis/jsonDB';
import userContext from '../contexts/UserContext';

const Payment = () => {
  const [message, setMessage] = useState('');
  const [messageTitle, setMessageTitle] = useState('');
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedClassID, setSelectedClassID] = React.useState();
  const [selectedClasses, setSelectedClasses] = React.useState([]);
  const [userClasses, setUserClasses] = React.useState([]);
  const [classes, setClasses] = React.useState([]);

  let navigate = useNavigate();
  let { user } = useContext(userContext);

  const fetchUserClasses = useCallback(async () => {
    if (!user) return;

    if (!('class' in user)) {
      setUserClasses([]);
      return;
    }

    let promises = Object.entries(user.class).map(([id, paid]) => jsonDB.get(`/classes/${id}`));
    let values = await Promise.all(promises);
    setUserClasses(
      values.map((value) => {
        value.data.startDate = new Date(value.data.startDate).toLocaleString();
        value.data.paid = user.class[value.data.id] ? 'Yes' : 'No';
        return value.data;
      })
    );
  }, [user]);

  const fetchAllClasses = useCallback(async () => {
    let data = await jsonDB.get('/classes');
    data.data = data.data.map((value) => {
      value.startDate = new Date(value.startDate).toLocaleString();
      return value;
    });
    setClasses(data.data);
  }, []);

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

  const handleSelectionChange2 = (selected) => {
    if (!selected) return;
    setSelectedClasses(selected);
  };

  const handlePayment = async () => {
    if (!user || !classes) return;
    let newUserInfo = await jsonDB.get(`users/${user.id}`);
    newUserInfo = newUserInfo.data;

    let classObj = classes.find((x) => selectedClassID === x.id);

    if ('class' in newUserInfo && !newUserInfo.class[selectedClassID]) {
      paymentServer
        .post(`/checkout?classID=${selectedClassID}&userID=${user.id}&price=${classObj.price}`)
        .then((response) => {
          window.location.href = response.data.checkoutURL;
        });
    } else {
      setMessage('You have already paid for this class!');
      setMessageTitle('Payment Error');
      handleDialogOpen();
    }
  };

  const handleEnroll = async () => {
    if (!user) return;

    let newUserInfo = await jsonDB.get(`users/${user.id}`);
    newUserInfo = newUserInfo.data;

    selectedClasses.map((c) => {
      if (!('class' in newUserInfo)) {
        newUserInfo.class = {};
      }
      if (!(c in newUserInfo.class)) {
        newUserInfo.class[c] = false;
      }
    });

    await jsonDB.put(`/users/${user.id}`, newUserInfo);

    let users = await jsonDB.get('/users');
    users = users.data;
    selectedClasses.forEach((c) => {
      let classObj = classes.find((x) => x.id === c);
      let message = `${user.name} (userID: ${user.id}) enrolled in ${classObj.name} (classID: ${classObj.id})`;

      users.forEach(async (u) => {
        if ((u.role === 'Coach' && 'class' in u && c in u.class) || u.role === 'Treasurer') {
          const data = await jsonDB.get(`/user_messages/${u.id}`);
          let user_messages = data.data;

          user_messages.messages = [
            ...user_messages.messages,
            { message, date: new Date(), sender: user.name, senderID: user.id, read: false },
          ];
          jsonDB.put(`/user_messages/${u.id}`, user_messages);
        }
      });
    });

    setMessage('You have enrolled in the class!');
    setMessageTitle('Enrollment Success');
    handleDialogOpen();
  };

  useEffect(() => {
    fetchUserClasses();
  }, [user, fetchUserClasses]);

  useEffect(() => {
    fetchAllClasses();
  }, [fetchAllClasses]);

  useEffect(() => {
    if (!user || !classes || classes.length === 0) {
      return;
    }

    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    const paymentSuccess = async () => {
      let user = await jsonDB.get(`users/${query.get('userID')}`);
      user = user.data;

      let d = new Date();

      user.class[query.get('classID')] = true;
      if (user["paid_classes"]){
        user["paid_classes"][query.get('classID')] = {date: d, price: query.get('price')};
      } else {
        user["paid_classes"] = {}
        user["paid_classes"][query.get('classID')] = {date: d, price: query.get('price')};
      }

      await jsonDB.put(`users/${query.get('userID')}`, user);

      let classObj = classes.find((x) => parseInt(query.get('classID')) == x.id);
      let paid = {name: user.name, "userID": user.id, "paidDate": d, price: "$" + query.get('price'), classID: query.get('classID'), className: classObj.name}
      await jsonDB.post(`/payments`, paid);

      let users = await jsonDB.get('/users');
      users = users.data;
      let message = `${user.name} (userID: ${user.id}) paid $${query.get('price')} for ${
        classObj.name
      } (classID: ${classObj.id})`;

      users.forEach(async (u) => {
        if (
          (u.role === 'Coach' && 'class' in u && classObj.id in u.class) ||
          u.role === 'Treasurer'
        ) {
          const data = await jsonDB.get(`/user_messages/${u.id}`);
          let user_messages = data.data;

          user_messages.messages = [
            ...user_messages.messages,
            { message, date: new Date(), sender: user.name, senderID: user.id, read: false },
          ];
          await jsonDB.put(`/user_messages/${u.id}`, user_messages);
        }
      });

      handleDialogOpen();
    };

    if (query.get('success')) {
      setMessage('Order placed! Thank you very much :)');
      setMessageTitle('Payment Success');
      paymentSuccess();
    }

    if (query.get('canceled')) {
      setMessage("Order canceled -- continue to shop around and checkout when you're ready.");
      setMessageTitle('Payment Cancelled');
      handleDialogOpen();
    }
  }, [user, classes]);

  let gridData = {
    columns: [
      { field: 'id', hide: true },
      { field: 'name', headerName: 'Name', width: '150' },
      { field: 'startDate', headerName: 'Start Date', width: '200' },
      { field: 'duration', headerName: 'Duration' },
      { field: 'paid', headerName: 'Paid' },
    ],
    rows: userClasses,
  };

  let gridData2 = {
    columns: [
      { field: 'id', hide: true },
      { field: 'name', headerName: 'Name', width: '150' },
      { field: 'startDate', headerName: 'Start Date', width: '200' },
      { field: 'duration', headerName: 'Duration' },
      { field: 'paid', headerName: 'Paid' },
    ],
    rows: classes.filter((x) => !userClasses.find((y) => x.id === y.id)),
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
          <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      <Typography sx={{ fontSize: 12 }} color="text.secondary">
        All Available Classes
      </Typography>
      <div style={{ display: 'flex', maxWidth: 800, minHeight: 300 }}>
        <DataGrid
          autoHeight
          checkboxSelection={true}
          components={{ Toolbar: GridToolbar }}
          onSelectionModelChange={handleSelectionChange2}
          {...gridData2}
        />
      </div>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        startIcon={<TimeIcon />}
        onClick={handleEnroll}
      >
        Enroll in Class
      </Button>

      <Typography sx={{ fontSize: 12, marginTop: 5 }} color="text.secondary">
        Your Scheduled Classes
      </Typography>
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

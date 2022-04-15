import React, { useState, useEffect, useContext } from 'react';

import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from "@mui/material/Typography";

import jsonDB from '../apis/jsonDB';
import userContext from '../contexts/UserContext';

const CoachMessage = () => {
  let loggedInUser = useContext(userContext).user;
  let [users, setUsers] = useState();
  let [selectedUsers, setSelectedUsers] = useState([]);
  let [textValue, setTextValue] = useState('');
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);

  const handleSelectionChange = (ids) => {
    if (!ids) return;
    const selectedIDs = new Set(ids);
    setSelectedUsers(users.filter((user) => selectedIDs.has(user.id)));
  };

  const handleSendMessage = async () => {
    if (!textValue) return;
    let message = textValue;
    setTextValue('');
    selectedUsers.forEach(async (user) => {
      const data = await jsonDB.get(`/user_messages/${user.id}`);
      const user_messages = data.data;

      user_messages.messages = [...user_messages.messages, { message, date: new Date(), sender: loggedInUser.name, senderID: loggedInUser.id, read: false}];
      jsonDB.put(`/user_messages/${user.id}`, user_messages);
    });

    handleDialogOpen();
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await jsonDB.get('/users');
      setUsers(data.data);
    };

    fetchUsers();
  }, []);

  if (!users) return <div>Loading...</div>;

  let gridData = {
    columns: [
      { field: 'id', hide: true },
      { field: 'name', headerName: 'Name' },
      { field: 'role', headerName: 'Role' },
      { field: 'address', headerName: 'Address', width: '190' },
      { field: 'phone', headerName: 'Phone Number', width: '150' },
    ],
    rows: users,
  };

  return (
    <div>
        <Typography sx={{ fontSize: 25 }} color="text.primary">
        Send Notification
      </Typography>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Message Sent"}</DialogTitle>
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

      <div style={{ display: 'flex', maxWidth: 600, minHeight: 300 }}>
        <DataGrid
          autoHeight
          checkboxSelection={true}
          components={{ Toolbar: GridToolbar }}
          onSelectionModelChange={handleSelectionChange}
          {...gridData}
        />
      </div>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '50ch' },
        }}
        noValidate
        autoComplete="off"
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            id="outlined-multiline-flexible"
            label="Message"
            placeholder="Type your message here..."
            multiline
            rows={5}
            value={textValue}
            onChange={(event) => setTextValue(event.target.value)}
          />
          <Button variant="contained" endIcon={<SendIcon />} onClick={handleSendMessage}>
            Send
          </Button>
        </div>
      </Box>
    </div>
  );
};

export default CoachMessage;

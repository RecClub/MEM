import React, { useState, useEffect, useContext, useCallback } from 'react';

import jsonDB from '../apis/jsonDB';
import userContext from '../contexts/UserContext';
import DeleteIcon from '@mui/icons-material/Delete';

// will deal w later
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import Button from "@material-ui/core/Button";

const defaultValues = {
  type: "",
  status: "",
  amount: "",
  date: "",
  priority: "",
};

const UnpaidDebt = () => {

  const [debt, setDebt] = React.useState([]);
  const [formValues, setFormValues] = useState(defaultValues);
  let [selectedDebt, setSelectedDebt] = useState([]);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSelectionChange = (ids) => {
    if (!ids) return;
    const selectedIDs = new Set(ids);
    setSelectedDebt(debt.filter((user) => selectedIDs.has(user.id)));
    console.log(selectedDebt);
  };

  const handleDeleteDebt = async () => {
    let promises = selectedDebt.map((user) => {
        return jsonDB.delete(`/debt/${user.id}`);
    });
    await Promise.all(promises);
    window.location.reload(false);
}

  const handleSubmit2 = async (event) => {
    event.preventDefault();
    let promises = selectedDebt.map((user) => {
      return jsonDB.put(`/debt/${user.id}`, {
        debtType: formValues.type,
        status: formValues.status,
        debtAmount: formValues.amount,
        debtStartDate: formValues.date,
        debtPriority: formValues.priority
      });
    });
    await Promise.all(promises);
    
    setOpen(false);
    window.location.reload(false);    
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    jsonDB.post("/debt", {
      debtType: formValues.type,
      status: formValues.status,
      debtAmount: formValues.amount,
      debtStartDate: formValues.date,
      debtPriority: formValues.priority
    });
    window.location.reload(false);    
  };

  useEffect(() => {
    // add sort based on priority
    const fetchDebt = async () => {
      const data = await jsonDB.get("/debt");
      console.log(data.data);
      setDebt(
        data.data
      );
    };
    fetchDebt();
  }, []);

  // grid for displaying debt
  let gridData = {
    columns: [
      { field: 'id', hide: true },
      { field: 'debtType', headerName: 'Type', width: "300" },
      { field: 'status', headerName: 'Status', width: "150" },
      { field: 'debtAmount', headerName: 'Amount', width: "200" },
      { field: 'debtStartDate', headerName: 'Start Date', width: "200" },
      { field: 'debtPriority', headerName: 'Priority' },
    ],
    rows: debt,
  };
  
  return (
    <div style={{ display: 'inline' }}>
      <DataGrid
          autoHeight
          components={{ Toolbar: GridToolbar }}
          onSelectionModelChange={handleSelectionChange}
          {...gridData}
        />
        <Button variant="contained" endIcon={<DeleteIcon /> } onClick={handleDeleteDebt} >
          Delete
        </Button>
        <Button variant="contained" onClick={handleClickOpen}>
          Modify
        </Button>
        <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Modify Debt Entry</DialogTitle>
        <DialogContent>
          <form style={{display: 'inline'}} onSubmit={handleSubmit}>
              <TextField
                required
                name="type"
                id="outlined-required"
                label="Debt Type"
                defaultValue={selectedDebt.length == 1 ? selectedDebt[0].debtType : ""}
                onChange={handleInputChange}
              />
              <br/>
              <br/>
              <TextField
                required
                name="status"
                id="outlined-required"
                label="Status"
                defaultValue={selectedDebt.length == 1 ? selectedDebt[0].status : ""}
                onChange={handleInputChange}
              />
              <br/>
              <br/>
              <TextField
                required
                id="outlined-required"
                label="Amount"
                name="amount"
                defaultValue={selectedDebt.length == 1 ? selectedDebt[0].debtAmount : ""}
                onChange={handleInputChange}
              />
              <br/>
              <br/>
              <TextField
                required
                id="outlined-required"
                label="Start Date"
                name="date"
                defaultValue={selectedDebt.length == 1 ? selectedDebt[0].debtStartDate : ""}
                onChange={handleInputChange}
              />
              <br/>
              <br/>
              <TextField
                required
                id="outlined-required"
                label="Priority"
                name="priority"
                defaultValue={selectedDebt.length == 1 ? selectedDebt[0].debtPriority : ""}
                onChange={handleInputChange}
              />
            </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit2}>Modify</Button>
        </DialogActions>
      </Dialog>
        
        <div style={{marginTop: '2%', display: 'flex'}}>
          <form style={{display: 'flex'}} onSubmit={handleSubmit}>
            <TextField
              required
              name="type"
              id="outlined-required"
              label="Debt Type"
              onChange={handleInputChange}
            />
            <TextField
              required
              name="status"
              id="outlined-required"
              label="Status"
              onChange={handleInputChange}
            />
            <TextField
              required
              id="outlined-required"
              label="Amount"
              name="amount"
              defaultValue="$"
              onChange={handleInputChange}
            />
            <TextField
              required
              id="outlined-required"
              label="Start Date"
              name="date"
              onChange={handleInputChange}
            />
            <TextField
              required
              id="outlined-required"
              label="Priority"
              name="priority"
              onChange={handleInputChange}
            />
            <Button variant="contained" color="primary" type="submit">
              Log
            </Button>
          </form>
        </div>
        
    </div>

    
  );

};

export default UnpaidDebt;

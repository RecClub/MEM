import React, { useState, useEffect, useContext, useCallback } from 'react';

import jsonDB from '../apis/jsonDB';
import userContext from '../contexts/UserContext';

// will deal w later
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    jsonDB.post("/debt", {
      debtType: formValues.type,
      status: formValues.status,
      debtAmount: formValues.amount,
      debtStartDate: formValues.date,
      debtPriority: formValues.priority
    })    
  };

  useEffect(() => {
    // add sort based on priority
    const fetchDebt = async () => {
      const data = await jsonDB.get("/debt");
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
          {...gridData}
        />
        
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

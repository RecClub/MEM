import React, { useState, useEffect, useContext, useCallback } from 'react';

import jsonDB from '../apis/jsonDB';
import userContext from '../contexts/UserContext';
import DeleteIcon from '@mui/icons-material/Delete';

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
  let [selectedDebt, setSelectedDebt] = useState([]);

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
  };

  const handleDeleteDebt = async () => {
    let promises = selectedDebt.map((user) => {
        return jsonDB.delete(`/debt/${user.id}`);
    });
    // handleSendMessage();
    await Promise.all(promises);
    window.location.reload(false);
}

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

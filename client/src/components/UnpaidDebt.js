import React, { useState, useEffect, useContext, useCallback } from 'react';

import jsonDB from '../apis/jsonDB';
import userContext from '../contexts/UserContext';

// will deal w later
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import PaymentIcon from '@mui/icons-material/Payment';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const UnpaidDebt = () => {

  const [debt, setDebt] = React.useState([]);

  useEffect(() => {
    const fetchDebt = async () => {
      const data = await jsonDB.get("/debt");
      setDebt(data.data);
    };

    fetchDebt();
  }, []);

  // grid for displaying debt
  let gridData = {
    columns: [
      { field: 'id', hide: true },
      { field: 'debtType', headerName: 'Type', width: "150" },
      { field: 'status', headerName: 'Status', width: "150" },
      { field: 'debtAmount', headerName: 'Amount', width: "200" },
      { field: 'debtStartDate', headerName: 'Start Date' },
      { field: 'debtPriority', headerName: 'Priority' },
    ],
    rows: debt,
  };
  
  return (
    <div style={{ display: 'flex' }}>
      <DataGrid
          autoHeight
          components={{ Toolbar: GridToolbar }}
          {...gridData}
        />

    </div>
  );

};

export default UnpaidDebt;

import React, { useState, useEffect } from 'react';

import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import jsonDB from '../apis/jsonDB';

const MemberLog = () => {
  let [users, setUsers] = useState();

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
      { field: 'phonenum', headerName: 'Phone Number' },
      { field: 'paid', headerName: 'Paid' },
      { field: 'address', headerName: 'Address' },
    ],
    rows: users,
  };

  return (
    <div>
      <div style={{ display: 'flex', maxWidth: 600, minHeight: 300 }}>
        <DataGrid
          autoHeight
          components={{ Toolbar: GridToolbar }}
          {...gridData}
        />
      </div>
    </div>
  );
};

export default MemberLog;

import React, { useState, useEffect } from 'react';

import { DataGrid } from '@mui/x-data-grid';

import jsonDB from '../apis/jsonDB';

const CoachMessage = () => {
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
      { field: 'role', headerName: 'Role' },
    ],
    rows: users,
  };

  return (
    <div style={{ height: 400 }}>
      <DataGrid checkboxSelection={true} {...gridData} />
    </div>
  );
};

export default CoachMessage;

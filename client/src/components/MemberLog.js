import React, { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import jsonDB from "../apis/jsonDB";

const MemberLog = () => {
  let [users, setUsers] = useState();

  const [value, setValue] = React.useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await jsonDB.get("/classlog");
      setUsers(data.data);
    };

    fetchUsers();
  }, []);

  if (!users) return <div>Loading...</div>;

  let gridData = {
    columns: [
      { field: "id", hide: true },
      { field: "attending", headerName: "Attending" },
      { field: "phonenum", headerName: "Phone Number" },
      { field: "paid", headerName: "Paid" },
      { field: "address", headerName: "Address" },
    ],
    rows: users,
  };

  return (
    <div>
      <div style={{ display: "flex", maxWidth: 600, minHeight: 300 }}>
        <FormControl fullWidth>
          <InputLabel>Classes</InputLabel>
          <Select
            value={value}
            onChange={handleChange}
          >
            <MenuItem value={10}>Class 1</MenuItem>
            <MenuItem value={20}>Class 2</MenuItem>
            <MenuItem value={30}>Class 3</MenuItem>
          </Select>
        </FormControl>

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

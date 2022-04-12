import React, { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import jsonDB from "../apis/jsonDB";

const MemberLog = () => {
  let [users, setUsers] = useState();

  const [classID, setValue] = React.useState(1);

  const handleChange = (event) => {
    setValue(parseInt(event.target.value));
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await jsonDB.get("/users");
      setUsers(data.data);
    };

    fetchUsers();
  }, []);

  if (!users) return <div>Loading...</div>;


  let filterlist = users.filter( x => {
    if(!("class" in x)) return false;
    return (classID in x.class);
  } )
  
  filterlist = filterlist.map(x => {x.paid = x.class[classID] ? "Yes" : "No"; return x})

  let gridData = {
    columns: [
      { field: "id", hide: true },
      { field: "name", headerName: "Name" },
      { field: "paid", headerName: "Paid" }
    ],
    rows: filterlist,
  };

  return (
    <div>
      <div style={{ display: "flex", maxWidth: 600, minHeight: 300 }}>
        <FormControl fullWidth>
          <InputLabel>Classes</InputLabel>
          <Select
            value={classID}
            onChange={handleChange}
          >
            <MenuItem value={1}>Class 1</MenuItem>
            <MenuItem value={2}>Class 2</MenuItem>
            <MenuItem value={3}>Class 3</MenuItem>
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

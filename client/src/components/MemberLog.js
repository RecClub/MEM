import React, { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";

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

  let filterlist = users.filter((x) => {
    if (!("class" in x)) return false;
    return classID in x.class;
  });

  filterlist = filterlist.map((x) => {
    x.paid = x.class[classID] ? "Yes" : "No";
    return x;
  });

  let nump = 0;

  for (let i = 1; i < users.length; i++) {
    //Check the number of times paid
    if (users.role === "Member") {
      for (let j = 1; j < users.class.length; j++) {
        if (users.class[j]) {
          nump++;
        }
      }
    
    //Update the number of times the user has attended
    users[i].attendance = users.class.length;
    
    //Update the number of times the user has paid
    users[i].nump = nump;
    
    //Grant discounts or give penalties
    if (nump < users.class.length) {
      users.penalty = "Yes";
    } else {
      users.penalty = "No";
    }
    if (nump === users.class.length && users.class.length > 16) {
      users.discount = "Yes";
    }
  }
  }

  let gridData = {
    columns: [
      { field: "id", hide: true },
      { field: "name", headerName: "Name" },
      { field: "paid", headerName: "Paid" },
      { field: "attendance", headerName: "Attendance" },
      { field: "nump", headerName: "Number of Times Paid" },
    ],
    rows: filterlist,
  };

  return (
    <div>
      <Typography sx={{ fontSize: 25 }} color="text.primary">
        Check Paid or Unpaid Members
      </Typography>
      <div style={{ display: "flex", maxWidth: 600, minHeight: 300 }}>
        <FormControl fullWidth>
          <Select value={classID} onChange={handleChange}>
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

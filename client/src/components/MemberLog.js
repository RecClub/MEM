import React, { useState, useEffect } from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";

import jsonDB from "../apis/jsonDB";

const MemberLog = () => {
  let [temp, setUsers] = useState();

  let [init, setInit] = useState(false);

  const [classID, setValue] = React.useState(1);

  const handleChange = (event) => {
    setValue(parseInt(event.target.value));
  };

  useEffect(() => {
    const fetchUsers = jsonDB.get("/users");

    fetchUsers.then((res) => {
      let users = res.data;
      let memberlist = users.filter((x) => {
        return (x.role == "Member");
      });
      let otherlist = users.filter((x) => {
        return !(x.role == "Member");
      });

      memberlist.sort((a , b ) => {
        return (b.attendance - a.attendance);
      });

      for (let i = 0; i < memberlist.length; i++) {
        let p = memberlist[i].id; 
        //Check the number of times paid
          let attends = 0;
          let nump = 0;
          for (const j in memberlist[i].class) {
            if (memberlist[i].class[j]) {
              nump++;
              memberlist[i].nump = nump;
            }
          }

          //Update the number of times the user has attended
          attends = Object.keys(memberlist[i].class).length;
          memberlist[i].attendance = attends;

          //Grant discounts or give penalties
          if (nump < attends) {
            memberlist[i].penalty = true;
          } else {
            memberlist[i].penalty = false;
          }
          if ((nump == attends && attends >= 12) || i < 10) {
            memberlist[i].discount = true;
          }
          jsonDB.put(`/users/${p}`, memberlist[i]);
      }


      setUsers([...otherlist, ...memberlist]);
      setInit(true);
    });
  }, [init]);


  if (!temp) return <div>Loading...</div>;

  let filterlist = temp.filter((x) => {
    if (!("class" in x)) return false;
    if (x.role == "Coach") return false;
    if (x.role == "Treasurer") return false;
    return classID in x.class;
  });

  filterlist = filterlist.map((x) => {
    x.paid = x.class[classID] ? "Yes" : "No";
    return x;
  });

  let memberlist = temp.filter((x) => {
    return (x.role == "Member");
  });

  let gridData = {
    columns: [
      { field: "id", hide: true },
      { field: "name", headerName: "Name" , width: 100},
      { field: "paid", headerName: "Paid" , width: 100},
      { field: "phone", headerName: "Phone Number" , width: 125},
      { field: "address", headerName: "Address" , width: 125},
    ],
    rows: filterlist,
  };

  let gridmemData = {
    columns: [
      { field: "id", hide: true },
      { field: "name", headerName: "Name" , width: 100},
      { field: "attendance", headerName: "Attendance" , width: 125},
      { field: "nump", headerName: "Number of Times Paid" , width: 175},
      
    ],
    rows: memberlist,
  };

  return (
    <div>
      <Typography sx={{ fontSize: 25 }} color="text.primary">
        Check Paid or Unpaid Members
      </Typography>
      <FormControl maxWidth>
        <Select style = {{display : "inline"}} value={classID} onChange={handleChange}>
            <MenuItem value={1}>Class 1</MenuItem>
            <MenuItem value={2}>Class 2</MenuItem>
            <MenuItem value={3}>Class 3</MenuItem>
          </Select>
        </FormControl>
      <div style={{ display: "flex", maxWidth: "auto", minHeight: 300 }}>
        <DataGrid
          autoHeight
          components={{ Toolbar: GridToolbar }}
          {...gridData}
        />
      </div>
      <div style={{ display: "flex", maxWidth: "auto", minHeight: 300 }}>
        <DataGrid
          autoHeight
          components={{ Toolbar: GridToolbar }}
          {...gridmemData}
        />
      </div>
    </div>
  );
};

export default MemberLog;

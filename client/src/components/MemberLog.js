import React, { useState, useEffect } from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";

import jsonDB from "../apis/jsonDB";

const MemberLog = () => {
  let [temp, setUsers] = useState();
  let [classList, setClassList] = useState();
  let [init, setInit] = useState(false);

  const [classID, setValue] = useState(1);

  const handleChange = (event) => {
    setValue(parseInt(event.target.value));
  };

  useEffect(() => {
    const fetchClass = async () => {
      const data = await jsonDB.get("/classes");
      setClassList(data.data);
    };

    fetchClass();
  }, []);

  useEffect(() => {
    if (!classList) return;

    const fetchUsers = jsonDB.get("/users");

    fetchUsers.then(async (res) => {
      let users = res.data;
      let memberlist = users.filter((x) => {
        return x.role == "Member";
      });
      let otherlist = users.filter((x) => {
        return !(x.role == "Member");
      });

      memberlist.sort((a, b) => {
        return b.attendance - a.attendance;
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
        attends = Object.entries(memberlist[i].class).filter(([cid,paid]) => {
          let cls = classList.find((c) => c.id === parseInt(cid));
          return new Date(cls.date) < new Date();
        }).length;

        console.log(attends);

        memberlist[i].attendance = attends;

        //Grant discounts or give penalties
        if (!memberlist[i].penalty && nump < attends) {
          memberlist[i].penalty = true;
          const data = await jsonDB.get(`/user_messages/${memberlist[i].id}`);
          const user_messages = data.data;
          
          let message = "You have missed a payment for a class, a penalty fee has been added.";
          user_messages.messages = [...user_messages.messages, { message, date: new Date(), sender: "Reminder Bot", senderID: 0, read: false}];
          await jsonDB.put(`/user_messages/${memberlist[i].id}`, user_messages);
        } else {
          memberlist[i].penalty = false;
        }
        if (!memberlist[i].penalty && !memberlist[i].discount && ((nump == attends && attends >= 12) || i < 10)) {
          memberlist[i].discount = true;
          const data = await jsonDB.get(`/user_messages/${memberlist[i].id}`);
          const user_messages = data.data;
          
          let message = "Thanks for consistently showing up for practice, you have earned a discount!";
          user_messages.messages = [...user_messages.messages, { message, date: new Date(), sender: "Reminder Bot", senderID: 0, read: false}];
          await jsonDB.put(`/user_messages/${memberlist[i].id}`, user_messages);
        }
        jsonDB.put(`/users/${p}`, memberlist[i]);
      }

      setUsers([...otherlist, ...memberlist]);
      setInit(true);
    });
  }, [init, classList]);

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
    return x.role == "Member";
  });

  let gridData = {
    columns: [
      { field: "id", hide: true },
      { field: "name", headerName: "Name", width: 100 },
      { field: "paid", headerName: "Paid", width: 100 },
      { field: "phone", headerName: "Phone Number", width: 125 },
      { field: "address", headerName: "Address", width: 125 },
    ],
    rows: filterlist,
  };

  let gridmemData = {
    columns: [
      { field: "id", hide: true },
      { field: "name", headerName: "Name", width: 100 },
      { field: "attendance", headerName: "Attendance", width: 125 },
      { field: "nump", headerName: "Number of Times Paid", width: 175 },
    ],
    rows: memberlist,
  };

  return (
    <div>
      <Typography sx={{ fontSize: 25 }} color="text.primary">
        Check Paid or Unpaid Members
      </Typography>
      <FormControl maxWidth>
        <Select
          style={{ display: "inline" }}
          value={classID}
          onChange={handleChange}
        >
          {classList.map((x) => (
            <MenuItem value={x.id}>{x.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <div style={{ display: "flex", maxWidth: "auto", minHeight: 300 }}>
        <DataGrid
          autoHeight
          components={{ Toolbar: GridToolbar }}
          {...gridData}
        />
      </div>
      <Typography sx={{ fontSize: 25 }} color="text.primary">
        Check Member List
      </Typography>
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

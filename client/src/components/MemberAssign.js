import React, { useState, useEffect, useContext } from "react";
import jsonDB from "../apis/jsonDB";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import userContext from "../contexts/UserContext";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import Typography from "@mui/material/Typography";

const MemberAssign = () => {


    let [users, setUsers] = useState();
    let [selectedMembers, setSelectedMembers] = useState([]);
    let [selectedClasses, setselectedClasses] = useState([]);
    let [classes, setClasses] = useState();
    let loggedInUser = useContext(userContext).user;

    
  const handleSelectionChange = (ids) => {
    if (!ids) return;
    const selectedIDs = new Set(ids);
    setSelectedMembers(users.filter((user) => selectedIDs.has(user.id)));
  };


  
  const handleClassSelectionChange = (ids) => {
    if (!ids) return;
    const selectedIDs = new Set(ids);
    setselectedClasses(
      classes.filter((classes) => selectedIDs.has(classes.id))
    );
  };

  const handleClasses = async () => {
    let promises = selectedMembers.map((user) => {
      selectedClasses.forEach((c) => {
        user.class[c.id] = true;
      });
      return jsonDB.put(`/users/${user.id}`, user);
    });
    handleSendMessage();
    await Promise.all(promises);
    window.location.reload(false);
  };

  const handleSendMessage = async () => {
    let message = "You have been assigned to a new class";
    // setTextValue('');
    selectedMembers.forEach(async (user) => {
      const data = await jsonDB.get(`/user_messages/${user.id}`);
      const user_messages = data.data;

      user_messages.messages = [
        ...user_messages.messages,
        {
          message,
          date: new Date(),
          sender: loggedInUser.name,
          senderID: loggedInUser.id,
          read: false,
        },
      ];
      jsonDB.put(`/user_messages/${user.id}`, user_messages);
    });

    // handleDialogOpen();
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await jsonDB.get("/users");
      setUsers(data.data);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchClass = async () => {
      const data = await jsonDB.get("/classes");
      setClasses(data.data);
    };

    fetchClass();
  }, []);

  if (!users) return <div>Loading...</div>;

  let filterlist = users.filter((x) => {
    return x.role === "Member";
  });

  const classList = classes;

  let gridData = {
    columns: [{ field: "id" }, { field: "name", headerName: "Name" }],
    rows: filterlist,
  };

  let gridData2 = {
    columns: [{ field: "id" }, { field: "name", headerName: "Name", width: '150' }],
    rows: classList,
  };

  return (
    <div>
      <Typography sx={{ fontSize: 25 }} color="text.primary">
        Assign Classes to Members
      </Typography>
      <div style={{ display: "flex" }}>
        <DataGrid
          autoHeight
          checkboxSelection={true}
          components={{ Toolbar: GridToolbar }}
          onSelectionModelChange={handleSelectionChange}
          {...gridData}
        />

        <DataGrid
          autoHeight
          checkboxSelection={true}
          components={{ Toolbar: GridToolbar }}
          onSelectionModelChange={handleClassSelectionChange}
          {...gridData2}
        />
      </div>

      <Button
        variant="contained"
        endIcon={<PersonAddAlt1Icon />}
        onClick={handleClasses}
      >
        Assign Class
      </Button>
    </div>
  );

};

export default MemberAssign;
import React, { useState, useEffect, useContext } from "react";
import jsonDB from "../apis/jsonDB";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import userContext from "../contexts/UserContext";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

const MemberClass = () => { 

let [users, setUsers] = useState();
let [selectedMember, setSelectedMember] = useState([]);
const [classID, setClassID] = React.useState(1);
let [classList, setClassList] = useState();
let [member, setMember] = useState();
let loggedInUser = useContext(userContext).user;

const handleChange = (event) => {
    setClassID(parseInt(event.target.value));
  };

const handleMemberSelectionChange = (ids) => {
    if (!ids) return;
    const selectedIDs = new Set(ids);
    setSelectedMember(
      member.filter((member) => selectedIDs.has(member.id))
    );
  };

const handleDeleteMember = async () => {
    let promises = selectedMember.map((user) => {
        let newClass = {};

        Object.entries(user.class).forEach(([k, v]) => {
            if (!(classID == k)) {
              newClass[k] = v;
            }
          });

  
        user.class = newClass;
        return jsonDB.put(`/users/${user.id}`, user);
      });
      handleSendMessage();
      await Promise.all(promises);
      window.location.reload(false);
};

const handleSendMessage = async () => {
  let message = "You have been removed from a class";
  // setTextValue('');
  selectedMember.forEach(async (user) => {
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
    if (!users) return;
    setMember(
      users.filter((x) => {
        return x.role === "Member";
      })
    );
  }, [users]);

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
      setClassList(data.data);
    };

    fetchClass();
  }, []);


  if (!users) return <div>Loading...</div>;

  if (!classList) return <div>Loading...</div>;

  if (!member) return <div>Loading...</div>;




// const c = classList.find((user) => user.id == classID);

let filterlist = member.filter((x) => {
    return classID in x.class;
  });

let gridData = {
    columns: [
      { field: "id", hide: true },
      { field: "name", headerName: "Name", width: 150 },
    ],
    rows: filterlist,
  };

  return (
    <div>
      <div style={{ maxWidth: 600, minHeight: 300 }}>
        <FormControl fullWidth>
          <Typography sx={{ fontSize: 25 }} color="text.primary">
            View and Unassign Members in their Class
          </Typography>
          <Select value={classID} onChange={handleChange}>
            {classList.map((x) => (
              <MenuItem value={x.id}>{x.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <DataGrid
          autoHeight
          checkboxSelection={true}
          components={{ Toolbar: GridToolbar }}
          onSelectionModelChange={handleMemberSelectionChange}
          {...gridData}
        />
        <Button
          variant="contained"
          endIcon={<PersonRemoveIcon />}
          onClick={handleDeleteMember}
        >
          Unassign Class
        </Button>
      </div>
    </div>
  );




};

export default MemberClass;
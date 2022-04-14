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

const CoachClass = () => {
  let [users, setUsers] = useState();
  let [classes, setClasses] = useState();
  let [coaches, setCoaches] = useState();
  const [coachID, setCoachID] = React.useState(1);
  let [selectedClasses, setselectedClasses] = useState([]);
  let loggedInUser = useContext(userContext).user;

  const handleChange = (event) => {
    setCoachID(parseInt(event.target.value));
  };

  const handleClassSelectionChange = (ids) => {
    if (!ids) return;
    const selectedIDs = new Set(ids);
    setselectedClasses(
      classes.filter((classes) => selectedIDs.has(classes.id))
    );
  };

  const handleDeleteCoach = async () => {
    const coach = users.find((user) => user.id == coachID);
    let newClass = {};
    Object.entries(coach.class).forEach(([k, v]) => {
      if (!selectedClasses.find((x) => k == x.id)) {
        newClass[k] = v;
      }
    });

    coach.class = newClass;
    handleSendMessage();
    await jsonDB.put(`/users/${coach.id}`, coach);

    window.location.reload(false);
  };

  const handleSendMessage = async () => {
    let message = "You have been removed from a class";
    // setTextValue('');
    
      const data = await jsonDB.get(`/user_messages/${coach.id}`);
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
      jsonDB.put(`/user_messages/${coach.id}`, user_messages);
    

    // handleDialogOpen();
  };

  useEffect(() => {
    if (!users) return;
    setCoaches(
      users.filter((x) => {
        return x.role === "Coach";
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
      setClasses(data.data);
    };

    fetchClass();
  }, []);

  if (!users) return <div>Loading...</div>;

  if (!classes) return <div>Loading...</div>;

  if (!coaches) return <div>Loading...</div>;

  const coach = users.find((user) => user.id == coachID);

  let filterlist = classes.filter((x) => {
    return x.id in coach.class;
  });

  // let filterlist = users.filter( x => {
  //     return (x.role === "Coach")
  //   } )

  let gridData = {
    columns: [
      { field: "id", hide: true },
      { field: "name", headerName: "Name", width: 150 },
      { field: "startDate", headerName: "StartDate", width: 200 },
      { field: "duration", headerName: "Duration" },
    ],
    rows: filterlist,
  };

  return (
    <div>
      <div style={{ maxWidth: 600, minHeight: 300 }}>
        <FormControl fullWidth>
          <Typography sx={{ fontSize: 25 }} color="text.primary">
            View and Unassign Classes for Coaches
          </Typography>
          <Select value={coachID} onChange={handleChange}>
            {coaches.map((x) => (
              <MenuItem value={x.id}>{x.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <DataGrid
          autoHeight
          checkboxSelection={true}
          components={{ Toolbar: GridToolbar }}
          onSelectionModelChange={handleClassSelectionChange}
          {...gridData}
        />
        <Button
          variant="contained"
          endIcon={<DeleteIcon />}
          onClick={handleDeleteCoach}
        >
          Unassign
        </Button>
      </div>
    </div>
  );
};
export default CoachClass;

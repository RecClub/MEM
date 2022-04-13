import React, { useState, useEffect, useContext} from "react";
import jsonDB from "../apis/jsonDB";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import userContext from '../contexts/UserContext';
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";

const CoachClass = () => {
    let [users, setUsers] = useState();
    let [classes, setClasses] = useState();
    let [coaches, setCoaches] = useState();
    const [coachID, setCoachID] = React.useState(1);

    const handleChange = (event) => {
        setCoachID(parseInt(event.target.value));
      };



    useEffect(() => {
        if (!users) return;
       setCoaches(users.filter( x => {
            return (x.role === "Coach") 
          } ))
    
       
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

      const coach = users.find((user) => user.id == coachID)

      let filterlist = classes.filter( x => {
        return (x.id in coach.class);
      } )

    // let filterlist = users.filter( x => {
    //     return (x.role === "Coach") 
    //   } )

      let gridData = {
        columns: [
          { field: "id", hide: true},
          { field: "name", headerName: "Name", width: 150 },
          { field: "startDate", headerName: "StartDate", width: 200 },
          { field: "duration", headerName: "Duration"},
        ],
        rows: filterlist,
      };


     

return (
    <div>
      <div style={{ maxWidth: 600, minHeight: 300 }}>
      <FormControl fullWidth>
          <InputLabel>Coach Classes</InputLabel>
          <Select
            value={coachID}
            onChange={handleChange}
          >
          {coaches.map((x) => <MenuItem value={x.id}>{x.name}</MenuItem>)}
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
export default CoachClass;


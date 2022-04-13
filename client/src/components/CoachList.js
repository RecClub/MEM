import React, { useState, useEffect } from "react";
import jsonDB from "../apis/jsonDB";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';


const CoachList = () => {

    let [users, setUsers] = useState();
    let [selectedUsers, setSelectedUsers] = useState([]);

    const handleSelectionChange = (ids) => {
        if (!ids) return;
        const selectedIDs = new Set(ids);
        setSelectedUsers(users.filter((user) => selectedIDs.has(user.id)));
      };

    const handleDeleteCoach = async () => {
        let promises = selectedUsers.map((user) => {
            return jsonDB.delete(`/users/${user.id}`);
        });
        await Promise.all(promises);
        window.location.reload(false);
    }

    useEffect(() => {
        const fetchUsers = async () => {
          const data = await jsonDB.get("/users");
          setUsers(data.data);
        };
    
        fetchUsers();
      }, []);


      if (!users) return <div>Loading...</div>;

      let filterlist = users.filter( x => {
        return (x.role === "Coach") 
      } )

      let gridData = {
        columns: [
          { field: "id"},
          { field: "name", headerName: "Name" },
        ],
        rows: filterlist,
      };


      return (
            <div>

            <DataGrid
                autoHeight
                checkboxSelection={true}
                components={{ Toolbar: GridToolbar }}
                onSelectionModelChange={handleSelectionChange}
                {...gridData}
            />
                      <Button variant="contained" endIcon={<DeleteIcon /> }onClick={handleDeleteCoach} >
                        Delete
                     </Button>

            </div>


      );
    
};








export default CoachList;
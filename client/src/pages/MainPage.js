import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import jsonDB from '../apis/jsonDB';

import { Link } from "react-router-dom";

import Context from '../contexts/UserContext';

const dbContext = React.createContext({
  users: [],
  setUsers: () => { }
});

const LoginPanel = (props) => {
  let [inputName, setInputName] = useState("");
  let [inputPsw, setInputPsw] = useState("");
  let [feedback, setFeedback] = useState(" ");

  let userList = props.users;
  let dest = "/";

  const OnNameChange = (e) => {
    setInputName(e.target.value);
  }

  const OnPswChange = (e) => {
    setInputPsw(e.target.value);
  }

  const getDest = () => {

    let filter = userList.filter(x => (x.name == inputName));
    if ((filter.length == 1) && (filter[0].password == inputPsw)) {
      dest += filter[0].role;
    }

    return dest;

  }

  const OnLogIn = () => {

    let filter = userList.filter(x => (x.name == inputName));
    if ((filter.length == 1) && (filter[0].password == inputPsw)) {
      props.setID({ 'userID': filter[0].id });
    } else {
      setFeedback("The username does not exist, or the password is inccorect.");
    }
  }

  return (
    <Paper sx={{ height: "30vmax", width: "30vmax", margin: "5px" }}>
      <Grid container sx={{ height: "90%", padding: "5px" }} direction="column" justifyContent="space-between" alignItems="stretch">
        <Grid item>
          <Typography variant='h4' component='h4'>
            Log In
          </Typography>
        </Grid>

        <Grid item>
          <TextField sx={{ width: "100%" }} required variant='standard' label='User Name' onChange={OnNameChange} value={inputName} />
        </Grid>

        <Grid item>
          <TextField type="password" sx={{ width: "100%" }} required variant='standard' label='Password' onChange={OnPswChange} value={inputPsw} />
        </Grid>

        <Grid item>
          <Button component={Link} onClick={OnLogIn} to={getDest()} variant='contained'>Log In</Button>
        </Grid>

      </Grid>


      <Grid container sx={{ height: "10%", padding: "5px" }} direction="column" justifyContent="space-between" alignItems="stretch">
        <Grid item>
          <Typography variant='body1' component='p'>
            {feedback}
          </Typography>
        </Grid>
      </Grid>


    </Paper>
  );
}

const RegisterPanel = (props) => {

  let [inputName, setInputName] = useState("");
  let [inputPsw, setInputPsw] = useState("");
  let [inputAddress, setInputAddress] = useState("");
  let [inputPhone, setPhone] = useState("");
  let [inputConfirmPsw, setInputConfirmPsw] = useState("");
  let [feedback, setFeedback] = useState(" ");

  let userList = props.users;

  const OnNameChange = (e) => {
    setInputName(e.target.value);
  }

  const OnAddressChange = (e) => {
    setInputAddress(e.target.value);
  }

  const OnPswChange = (e) => {
    setInputPsw(e.target.value);
  }

  const onPhoneChange = (e) => {
    setPhone(e.target.value);
  }

  const OnConfirmPswChange = (e) => {
    setInputConfirmPsw(e.target.value);
  }

  const OnRegister = () => {

    const spaceRegex = new RegExp('^(\s)*$');



    if (!spaceRegex.test(inputName)) {
      if (!spaceRegex.test(inputAddress)) {
        if (!spaceRegex.test(inputPhone)) {
          if ((!spaceRegex.test(inputPsw)) && (inputPsw == inputConfirmPsw)) {

            let filter = userList.filter(x => (x.name == inputName));
            if (filter.length == 0) {
              let id = userList.length + 1;
              userList.push({
                id,
                name: inputName,
                phone: inputPhone,
                address: inputAddress,
                class: {},
                role: "Member",
                password: inputPsw
              })

              props.setUsers(userList);

              jsonDB.post("/users", {
                name: inputName,
                phone: inputPhone,
                address: inputAddress,
                class: {},
                role: "Member",
                password: inputPsw
              })

              setFeedback(" ");

            } else {
              setFeedback("User already exist.");
            }

          } else {
            setFeedback("Please confirm your password.");
          }
        } else {
          setFeedback("Phone number may not be blank.");
        }
      } else {
        setFeedback("Address may not be blank.");
      }
    } else {
      setFeedback("Username may not be blank.");
    }

  }

  return (
    <Paper sx={{ height: "30vmax", width: "30vmax", margin: "5px" }}>

      <Grid container sx={{ height: "90%", padding: "5px" }} direction="column" justifyContent="space-between" alignItems="stretch">

        <Grid item>
          <Typography variant='h4' component='h4'>
            Register
          </Typography>
        </Grid>

        <Grid item>
          <TextField sx={{ width: "100%" }} required variant='standard' label='User Name' onChange={OnNameChange} value={inputName} />
        </Grid>

        <Grid item>
          <TextField sx={{ width: "100%" }} required variant='standard' label='Phone Number' onChange={onPhoneChange} value={inputPhone} />
        </Grid>

        <Grid item>
          <TextField sx={{ width: "100%" }} required variant='standard' label='Address' onChange={OnAddressChange} value={inputAddress} />
        </Grid>

        <Grid item>
          <TextField type="password" sx={{ width: "100%" }} required variant='standard' label='Password' onChange={OnPswChange} value={inputPsw} />
        </Grid>


        <Grid item>
          <TextField type="password" sx={{ width: "100%" }} required variant='standard' label='Confirm Password' onChange={OnConfirmPswChange} value={inputConfirmPsw} />
        </Grid>


        <Grid item>
          <Button variant='contained' onClick={OnRegister}>Register</Button>
        </Grid>

      </Grid>

      <Grid container sx={{ height: "10%", padding: "5px" }} direction="column" justifyContent="space-between" alignItems="stretch">
        <Grid item>
          <Typography variant='body1' component='p'>
            {feedback}
          </Typography>
        </Grid>
      </Grid>

    </Paper>
  );
}

const MainPage = () => {

  let [users, setUsers] = useState([]);

  useEffect(() => {
    let getReq = jsonDB.get("/users");
    getReq.then(res => setUsers(res.data));
  }, [])

  return (

    <dbContext.Provider value={{ users, setUsers }}>
      <dbContext.Consumer>

        {({ users, setUsers }) => (
          <Context.Consumer>
            {({ userID, setUserID }) => (
              <Grid sx={{ height: "calc(100vh - 68.5px)", width: "100vw" }} container justifyContent="center" alignItems="center">
                <Grid item>
                  <LoginPanel users={users} setID={setUserID} />
                </Grid>
                <Grid item>
                  <RegisterPanel users={users} setUsers={setUsers} />
                </Grid>
              </Grid>
            )}
          </Context.Consumer>
        )}

      </dbContext.Consumer>
    </dbContext.Provider>

  );
};

export default MainPage;

import React, { useState, useEffect } from 'react';
import jsonDB from '../apis/jsonDB';


const Context = React.createContext({'userID': ""});

export const UserStore = (props) => {
  const [userID, setUserID] = useState({'userID': localStorage.getItem("userID")});
  const [user, setUser] = useState({});

  let id = userID.userID;
  useEffect(() => {
    localStorage.setItem("userID", id);

    const fetchUser = async () => {
      let id = userID.userID;
      if (!id) return;
      let data = await jsonDB.get(`users/${id}`);
      setUser(data.data);
    };

    fetchUser();
  }, [userID])

  return <Context.Provider value={{ userID, setUserID, user }}>{props.children}</Context.Provider>;
};

export default Context;
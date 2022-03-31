import React, { useState } from 'react';

const Context = React.createContext({'userID': ""});

export const UserStore = (props) => {
  const [userID, setUserID] = useState({'userID': ""});

  return <Context.Provider value={{ userID, setUserID }}>{props.children}</Context.Provider>;
};

export default Context;
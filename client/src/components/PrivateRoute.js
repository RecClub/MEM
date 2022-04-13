import React, {useContext}from 'react';
import {
  Navigate,
  useLocation,
} from "react-router-dom";

import userContext from '../contexts/UserContext';

const PrivateRoute = (props) => {
  const { children } = props
  let {userID, setUserID} = useContext(userContext);
  const isLoggedIn = userID.userID !== "";
  const location = useLocation()

  return isLoggedIn ? (
    <>{children}</>
  ) : (
    <Navigate
      replace={true}
      to="/"
      state={{ from: `${location.pathname}${location.search}` }}
    />
  )
}

export default PrivateRoute;
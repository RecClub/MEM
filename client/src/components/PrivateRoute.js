import React, {useContext, useEffect}from 'react';
import {
  Navigate,
  useLocation,
} from "react-router-dom";

import userContext from '../contexts/UserContext';

const PrivateRoute = (props) => {
  const { children } = props
  let {userID, setUserID, user} = useContext(userContext);
  const isLoggedIn = userID.userID !== "";
  const location = useLocation()

  useEffect(() => {
  }, [user]);

  if (!user.role) return <div>Loading...</div>;

  return isLoggedIn && `/${user.role}` == location.pathname ? (
    <>{children}</>
  ) : (
    <Navigate
      replace={true}
      to={isLoggedIn ? `/${user.role}` : "/"}
      state={{ from: `${location.pathname}${location.search}` }}
    />
  )
}

export default PrivateRoute;
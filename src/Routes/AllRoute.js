// import { useRoutes } from 'react-router-dom';
// import Dashboardpage from '../Component/Dashboardpage';
// import Attendancepage from '../Component/Attendancepage';
// import Leavepage from '../Component/Leavepage';
// import Reportpage from '../Component/Reportpage';
// import Login from '../Component/Login';


// const AllRoute = () => {
//   return useRoutes([
//     { path: "/", element: <Dashboardpage /> },
//     { path: "/attendance", element: <Attendancepage /> },
//     { path: "/leave", element: <Leavepage /> },
//     { path: "/report", element: <Reportpage /> },
//     { path: "/login", element: <Login /> },
//   ]);
// };

// export default AllRoute;

import { useRoutes, Navigate } from "react-router-dom";
import Dashboardpage from "../Component/Dashboardpage";
import Attendancepage from "../Component/Attendancepage";
import Leavepage from "../Component/Leavepage";
import Reportpage from "../Component/Reportpage";
import Login from "../Component/Login";

const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const user = JSON.parse(localStorage.getItem("user")); // Get user role from localStorage
    return user.role;
  } catch (error) {
    return null;
  }
};

const AllRoute = () => {
  const role = getUserRole();

  let routes = [
    { path: "/login", element: <Login /> }, // Login always available
  ];

  if (role === "Faculty") {
    routes.push(
      { path: "/", element: <Dashboardpage /> },
      { path: "/attendance", element: <Attendancepage /> },
      { path: "/report", element: <Reportpage /> },
      { path: "*", element: <Navigate to="/" replace /> } // Redirect unknown paths
    );
  } else if (role === "Student") {
    routes.push(
      { path: "/leave", element: <Leavepage /> },
      { path: "*", element: <Navigate to="/leave" replace /> } // Redirect unknown paths
    );
  } else {
    routes = [{ path: "*", element: <Navigate to="/login" replace /> }];
  }

  return useRoutes(routes);
};

export default AllRoute;

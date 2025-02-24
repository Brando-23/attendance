import { useRoutes } from 'react-router-dom';
import Dashboardpage from '../Component/Dashboardpage';
import Attendancepage from '../Component/Attendancepage';
import Leavepage from '../Component/Leavepage';
import Reportpage from '../Component/Reportpage';


const AllRoute = () => {
  return useRoutes([
    { path: "/", element: <Dashboardpage /> },
    { path: "/attendance", element: <Attendancepage /> },
    { path: "/leave", element: <Leavepage /> },
    { path: "/report", element: <Reportpage /> }
  ]);
};

export default AllRoute;

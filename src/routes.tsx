import { createBrowserRouter} from 'react-router-dom';
import DashboardLayout from './Components/Layout/DashboardLayout';
import Dashboard from './Components/Screens/Dashboard';
import NotFound from './Components/Screens/Notfound';
import ProtectedRoute from './Config/ProtectedRoute';
import Login from './Components/Screens/Auth/Login';


// const isAuthenticated = localStorage.getItem("authenticated"); 

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <ProtectedRoute isAuthenticated={true} />,
    children: [
      {
        path: "/",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "*",
            element: <NotFound />,
          },
        ],
      },
    ],
  },
]);



export default router

import { createBrowserRouter } from "react-router";

import Home from "../pages/Home";
import Root from "../layout/Root";
import Rooms from "../pages/Rooms";
import RoomDetails from "../pages/RoomDetails";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";
import UserLogin from "../pages/UserLogin";
import PrivateRoute from "./PrivateRoute";
import UserProfile from "../pages/UserProfile";
import CreateReservation from "../pages/CreateReservation";
import Myreservations from "../pages/Myreservations";
import EditProfile from "../pages/EditProfile";
import PasswordChange from "../pages/PasswordChange";

import AdminRoot from "../layout/AdminRoot";
import Dashboard from "../pages/admin/Dashboard";
import AdminPrivateRoute from "./AdminPrivateRoute";
import EditRooms from "../pages/admin/EditRooms";
import Categories from "../pages/admin/Categories";
import EditCategories from "../pages/admin/EditCategories";
import RoomStaus from "../pages/admin/RoomStaus";
import EditRoomstatus from "../pages/admin/EditRoomstatus";
import FrontDesk from "../pages/FrontDesk/FrontDesk";
import FrontdeskRoute from "./FrontdeskRoute";
import FrontRoot from "./FrontdeskRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <UserLogin />,
      },
      {
        path: "rooms",
        element: <Rooms />,
      },
      {
        path: "room-details/:id",
        element: (
          <PrivateRoute>
            <RoomDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "register",
        element: <Signup />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "change-password",
        element: (
          <PrivateRoute>
            <PasswordChange />
          </PrivateRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "edit-profile",
        element: (
          <PrivateRoute>
            <EditProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "create-reservation/:id",
        element: (
          <PrivateRoute>
            <CreateReservation />
          </PrivateRoute>
        ),
      },
      {
        path: "myreservation",
        element: (
          <PrivateRoute>
            <Myreservations />
          </PrivateRoute>
        ),
      },
    ],
  },

  // =========================
  // ADMIN ROUTES
  // =========================
  {
    path: "/admin",
    element: (
      <AdminPrivateRoute>
        <AdminRoot />
      </AdminPrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "edit-room/:id",
        element: <EditRooms />,
      },
      {
        path: "room-type",
        element: <Categories />,
      },
      {
        path:'edit-category/:id',
        element:<EditCategories/>
      },
      {
        path:'room-staus',
        element:<RoomStaus/>
      },
      {
        path:'edit-status/:id',
        element:<EditRoomstatus/>
      }
    ],
  },
  // =========================
  // Front desk route 
  //==========================
  {
    path:"front-desk",
    element:(
      <FrontdeskRoute>
        <FrontRoot/>
      </FrontdeskRoute>
    ),
    children:[
      {
        index:true,
        element:<FrontDesk/>
      }
    ]
  }

]);

export default router;


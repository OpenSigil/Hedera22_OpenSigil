// import
import Dashboard from "views/Dashboard/Dashboard.js";
import Encryption from "views/Dashboard/Encryption";
import SignIn from "views/Pages/SignIn.js";
import SignOut from "views/Pages/SignOut.js";

import {
  HomeIcon,
  DocumentIcon,
  RocketIcon
} from "components/Icons/Icons";

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: <HomeIcon color="inherit" />,
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/encryption",
    name: "Encrypt & Decrypt",
    icon: <DocumentIcon color="inherit" />,
    component: Encryption,
    layout: "/admin",
  },
  {
    name: "My Account",
    category: "account",
    state: "pageCollapse",
    views: [
      {
        path: "/signin",
        name: "Sign In",
        icon: <DocumentIcon color="inherit" />,
        component: SignIn,
        layout: "/auth",
        hide: true
      },
      {
        path: "/signout",
        name: "Logout",
        icon: <RocketIcon color="inherit" />,
        component: SignOut,
        layout: "/auth",
      },
    ],
  },
];
export default dashRoutes;

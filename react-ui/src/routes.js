// import
import Dashboard from "views/Dashboard/Dashboard.js";
import MyFiles from "views/Dashboard/MyFiles";
import Profile from "views/Dashboard/Profile.js";
import SignIn from "views/Pages/SignIn.js";
import SignUp from "views/Pages/SignUp.js";
import SignOut from "views/Pages/SignOut.js";

import {
  HomeIcon,
  StatsIcon,
  CreditIcon,
  PersonIcon,
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
    path: "/files",
    name: "My Files",
    icon: <HomeIcon color="inherit" />,
    component: MyFiles,
    layout: "/admin",
  },
  {
    name: "ACCOUNT PAGES",
    category: "account",
    state: "pageCollapse",
    views: [
      {
        path: "/profile",
        name: "Profile",
        icon: <PersonIcon color="inherit" />,
        secondaryNavbar: true,
        component: Profile,
        layout: "/admin",
      },
      {
        path: "/signin",
        name: "Sign In",
        icon: <DocumentIcon color="inherit" />,
        component: SignIn,
        layout: "/auth",
        hide: true
      },
      {
        path: "/signup",
        name: "Sign Up",
        icon: <RocketIcon color="inherit" />,
        secondaryNavbar: true,
        component: SignUp,
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

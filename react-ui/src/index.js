/*!

=========================================================
* Purity UI Dashboard - v1.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/purity-ui-dashboard
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/purity-ui-dashboard/blob/master/LICENSE.md)

* Design by Creative Tim & Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

import AuthLayout from "layouts/Auth.js";
import AdminLayout from "layouts/Admin.js";

import { AuthProvider } from "auth-context/auth.context";
import { HashConnect } from "hashconnect";
import HashConnectProvider from "auth-context/HashConnectProvider";
import { ProtectedRoute } from "layouts/ProtectedRoute";

const hashConnect = new HashConnect(true);

let user = localStorage.getItem("user");
user = JSON.parse(user);

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <AuthProvider userData={user}>
    <HashConnectProvider hashConnect={hashConnect} debug>
      <HashRouter>
        <Switch>
          <Route path={"/auth"} component={AuthLayout} />
          <ProtectedRoute path={"/admin"} component={AdminLayout} />
          <Redirect from={"/"} to="/admin/dashboard" />
        </Switch>
      </HashRouter>
    </HashConnectProvider>
  </AuthProvider>
);

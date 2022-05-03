import React from "react";
import { Route } from "react-router-dom";
import { useAuth } from "auth-context/auth.context";
import { useHistory } from "react-router-dom";
import { useHashConnect } from "../auth-context/HashConnectProvider";

export const ProtectedRoute = ({ ...rest }) => {
  const history = useHistory();
  let { user } = useAuth();
  const { walletData } = useHashConnect();


  if (walletData?.accountIds?.length == null || walletData?.accountIds?.length == 0) {
    history.push("/auth/signin")
  }

  return <Route {...rest} />;
};

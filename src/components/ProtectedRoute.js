import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

export default function ProtectedRoute(props) {
  return auth.currentUser
    ? props.children
    : React.createElement(Navigate, { to: "/" });
}

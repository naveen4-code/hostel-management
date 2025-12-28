import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import Tenants from "./pages/Tenants";
import Complaints from "./pages/Complaints";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

export default function App() {
  return React.createElement(
    BrowserRouter,
    null,
    React.createElement(Navbar),
    React.createElement(
      Routes,
      null,
      React.createElement(Route, { path: "/", element: React.createElement(Login) }),
      React.createElement(Route, {
        path: "/dashboard",
        element: React.createElement(ProtectedRoute, null, React.createElement(Dashboard))
      }),
      React.createElement(Route, {
        path: "/rooms",
        element: React.createElement(ProtectedRoute, null, React.createElement(Rooms))
      }),
      React.createElement(Route, {
        path: "/tenants",
        element: React.createElement(ProtectedRoute, null, React.createElement(Tenants))
      }),
      React.createElement(Route, {
        path: "/complaints",
        element: React.createElement(ProtectedRoute, null, React.createElement(Complaints))
      })
    )
  );
}

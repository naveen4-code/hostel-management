import React from "react";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Navbar() {
  return React.createElement(
    "div",
    { className: "bg-gray-900 text-white p-4 flex gap-4 items-center" },
    React.createElement(Link, { to: "/dashboard", className: "hover:text-blue-400" }, "Dashboard"),
    React.createElement(Link, { to: "/rooms", className: "hover:text-blue-400" }, "Rooms"),
    React.createElement(Link, { to: "/tenants", className: "hover:text-blue-400" }, "Tenants"),
    React.createElement(Link, { to: "/complaints", className: "hover:text-blue-400" }, "Complaints"),
    React.createElement(
      "button",
      {
        onClick: () => signOut(auth),
        className: "ml-auto bg-red-500 px-4 py-1 rounded hover:bg-red-600"
      },
      "Logout"
    )
  );
}

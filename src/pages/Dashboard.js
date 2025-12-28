import React from "react";

export default function Dashboard() {
  return React.createElement(
    "div",
    { className: "p-6 grid grid-cols-1 md:grid-cols-3 gap-4" },

    React.createElement(
      "div",
      { className: "bg-white shadow rounded p-4 text-center" },
      React.createElement("h2", { className: "text-xl font-bold" }, "Rooms"),
      React.createElement("p", { className: "text-gray-500" }, "Total Rooms")
    ),

    React.createElement(
      "div",
      { className: "bg-white shadow rounded p-4 text-center" },
      React.createElement("h2", { className: "text-xl font-bold" }, "Tenants"),
      React.createElement("p", { className: "text-gray-500" }, "Active Tenants")
    ),

    React.createElement(
      "div",
      { className: "bg-white shadow rounded p-4 text-center" },
      React.createElement("h2", { className: "text-xl font-bold" }, "Complaints"),
      React.createElement("p", { className: "text-gray-500" }, "Pending Issues")
    )
  );
}

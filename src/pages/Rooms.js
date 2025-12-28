import React from "react";

export default function Rooms() {
  return React.createElement(
    "div",
    { className: "p-6" },
    React.createElement("h2", { className: "text-2xl font-bold mb-4" }, "Rooms"),
    React.createElement(
      "div",
      { className: "bg-white shadow rounded p-4" },
      "Room allocation and availability"
    )
  );
}

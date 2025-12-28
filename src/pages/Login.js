import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const login = async () => {
    await signInWithPopup(auth, provider);
    navigate("/dashboard");
  };

  return React.createElement(
    "div",
    { className: "min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600" },
    React.createElement(
      "div",
      { className: "bg-white p-8 rounded-xl shadow-lg text-center w-96" },
      React.createElement("h1", { className: "text-2xl font-bold mb-4" }, "Hostel Management"),
      React.createElement(
        "button",
        {
          onClick: login,
          className: "bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        },
        "Sign in with Google"
      )
    )
  );
}

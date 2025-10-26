// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { UserProvider } from "./context/UserContext";
import { CaseProvider } from "./context/CaseContext"; // 1. Import it
import "./index.css"; // Your global stylesheet

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {/* UserProvider must be on the outside */}
    <UserProvider>
      {/* CaseProvider is inside UserProvider, wrapping App */}
      <CaseProvider>
        <App />
      </CaseProvider>
    </UserProvider>
  </BrowserRouter>
);

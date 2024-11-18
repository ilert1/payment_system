import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AppProvider } from "./AppContext";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    // <React.StrictMode>
    <AppProvider>
        <App />
    </AppProvider>
    // </React.StrictMode>,
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

import "./index.css";
import "./styles/theme.css";
import "./smart-pave-theme.css";
import "leaflet/dist/leaflet.css";
import { Toaster } from "react-hot-toast";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      reverseOrder={false}
    />
  </StrictMode>
);
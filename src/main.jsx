import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import { PrimeReactProvider } from "primereact/api";
import { SocketProvider } from "./contexts/SocketContext.jsx";

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <SocketProvider>
      <ThemeProvider>
        <PrimeReactProvider>
          <App />
        </PrimeReactProvider>
      </ThemeProvider>
      </SocketProvider>
    </BrowserRouter>
);

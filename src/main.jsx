import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import { PrimeReactProvider } from "primereact/api";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
        <PrimeReactProvider>
      <ThemeProvider>
          <App />
      </ThemeProvider>
        </PrimeReactProvider>
    </BrowserRouter>
  </StrictMode>
);

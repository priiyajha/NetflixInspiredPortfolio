import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Force dark theme
document.documentElement.classList.add("dark");

// Performance optimization: Mark critical CSS as loaded
if (document.fonts) {
  document.fonts.ready.then(() => {
    document.documentElement.classList.add('fonts-loaded');
  });
}

createRoot(document.getElementById("root")!).render(<App />);

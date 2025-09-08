import React from "react";
import ReactDOM from "react-dom/client";
import AppWrapper from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";

// Global error handlers to surface runtime errors in console
window.addEventListener('error', (event) => {
  console.error('[Global error] ', event.error || event.message, event);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[Unhandled promise rejection] ', event.reason);
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppWrapper />
    </ErrorBoundary>
  </React.StrictMode>
);
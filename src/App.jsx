import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Fragment, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Dashboard from "./pages/Dashboard";
import AddStudent from "./pages/AddStudent";
import EditStudent from "./pages/EditStudent";
import NotFound from "./pages/NotFound";

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <BrowserRouter future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route
              path="/"
              element={
                  <Dashboard />
              }
            />

            <Route
              path="/add"
              element={
                  <AddStudent />
              }
            />

            <Route
              path="/edit/:id"
              element={
                  <EditStudent />
              }
            />

            {/* 404 - Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </BrowserRouter>
  );
}

function AppWrapper() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default AppWrapper;
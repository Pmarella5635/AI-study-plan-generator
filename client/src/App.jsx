import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PlanProvider } from "./contexts/PlanContext";
import PrivateRoute from "./components/common/PrivateRoute";
import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";
import Generate from "./pages/Generate";
import History from "./pages/History";
import Tracking from "./pages/Tracking";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import "./styles/index.scss";

const App = () => {
  return (
    <AuthProvider>
      <PlanProvider>
        <Router>
          <div className="app-container">
            <Navbar />

            <div className="content-wrapper">
              <Sidebar />

              <main className="main-content">
                <Routes>
                  <Route path="/login" element={<Login />} />

                  <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                  <Route path="/generate" element={<PrivateRoute><Generate /></PrivateRoute>} />
                  <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
                  <Route path="/tracking/:planId" element={<PrivateRoute><Tracking /></PrivateRoute>} />

                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" />} />
                </Routes>
              </main>
            </div>

            <Footer />
          </div>
        </Router>
      </PlanProvider>
    </AuthProvider>
  );
};

export default App;

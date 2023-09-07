import React, { Component } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import BrowserRouter and rename it as Router
import LoginComponent from "./components/LoginComponent";
import DashboardComponent from "./components/DashboardComponent";
import { RequireAuth } from "./components/RequireAuth";
import { AuthProvider } from "./components/AuthProvider";

class App extends Component {
  render() {
    return (
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginComponent />} />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <DashboardComponent />
                </RequireAuth>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    );
  }
}

export default App;

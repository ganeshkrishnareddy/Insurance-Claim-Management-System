import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClaimsProvider } from './context/ClaimsContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import ClaimForm from './components/ClaimForm';
import ClaimDetails from './components/ClaimDetails';
import Login from './components/Login';
import AllClaims from './components/AllClaims';
import './App.css';

const RequireAuth = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ClaimsProvider>
          <div className="app">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              } />
              <Route path="/all-claims" element={
                <RequireAuth>
                  <AllClaims />
                </RequireAuth>
              } />
              <Route path="/new" element={
                <RequireAuth>
                  <ClaimForm />
                </RequireAuth>
              } />
              <Route path="/claim/:id" element={
                <RequireAuth>
                  <ClaimDetails />
                </RequireAuth>
              } />
            </Routes>
          </div>
        </ClaimsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import HomePage from './pages/HomePage.jsx'; 
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import TransactionsPage from './pages/TransactionsPage.jsx';
import ComingSoonPage from './pages/ComingSoonPage.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* נתיב דף הבית הציבורי */}
          <Route path="/" element={<HomePage />} /> 
          
          {/* נתיבים ציבוריים */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* נתיבים מוגנים - רק למשתמשים מחוברים */}
          <Route element={<PrivateRoute />}>
            {/* נתיבים מוגנים יתחילו מפה: */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
          </Route>
          {/* דפי Footer זמניים */}
          <Route path="/privacy" element={<ComingSoonPage title="Privacy Policy" />} />
          <Route path="/terms" element={<ComingSoonPage title="Terms & Conditions" />} />
          <Route path="/services" element={<ComingSoonPage title="Services" />} />
          <Route path="/contact" element={<ComingSoonPage title="Contact Us" />} />

          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material'; // רכיב טעינה מ-MUI

const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth(); // נניח שיש לנו מצב טעינה ב-Context

  // אם ה-Context עדיין בודק אם יש טוקן או נתונים
  if (isLoading) { 
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // אם מחובר, מציג את הרכיבים הפנימיים (Outlet)
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
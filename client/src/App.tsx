
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import DocsPage from './pages/DocsPage';
import RatingPage from './pages/RatingPage';
import CVGeneratorPage from './pages/CVGeneratorPage'; // Import trang mới
import './App.css';
import { IUser } from './class/types';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const [currentUser, setCurrentUser] = useState<IUser | null>(() => {
    const storedUser = localStorage.getItem('currentUser');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        localStorage.clear();
        return null;
      }
    }
    return null;
  });

  const handleUserUpdate = (user: IUser) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  const isLoggedIn = !!currentUser;

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to={isLoggedIn ? "/home" : "/login"} />} />
            <Route path="/register" element={isLoggedIn ? <Navigate to="/home" /> : <RegisterPage />} />
            <Route
              path="/login"
              element={isLoggedIn ? <Navigate to="/home" /> : <LoginPage onLoginSuccess={handleUserUpdate} />}
            />
            <Route
              path="/home"
              element={isLoggedIn ? <HomePage onLogout={handleLogout} currentUser={currentUser} /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile"
              element={isLoggedIn ? <ProfilePage currentUser={currentUser!} onUpdateUser={handleUserUpdate} onLogout={handleLogout} /> : <Navigate to="/login" />}
            />
            <Route
              path="/docs"
              element={isLoggedIn ? <DocsPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/rating"
              element={isLoggedIn ? <RatingPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/cv-generator"
              element={isLoggedIn ? <CVGeneratorPage /> : <Navigate to="/login" />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

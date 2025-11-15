import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // Import trang mới
import './App.css';

function App() {
  // Kiểm tra token trong localStorage để duy trì trạng thái đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          {/* Thêm nút Logout nếu đã đăng nhập */}
          {isLoggedIn && (
            <nav style={{ position: 'absolute', top: 10, right: 10 }}>
              <button onClick={handleLogout}>Đăng xuất</button>
            </nav>
          )}

          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />

            <Route path="/register" element={<RegisterPage />} />

            <Route
              path="/login"
              element={isLoggedIn ? <Navigate to="/home" /> : <LoginPage onLoginSuccess={handleLoginSuccess} />}
            />

            <Route
              path="/home"
              element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />}
            />
          </Routes>
        </header>
      </div>
    </BrowserRouter>
  );
}

export default App;
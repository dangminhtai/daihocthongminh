import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import './App.css';

function App() {
  // Giả lập trạng thái đăng nhập. Trong ứng dụng thật bạn sẽ dùng token (JWT)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />

            <Route
              path="/login"
              element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
            />

            {/* Đây là Route được bảo vệ */}
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
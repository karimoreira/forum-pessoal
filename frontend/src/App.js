import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AuthStatus from './components/AuthStatus'; 
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NewPostPage from './pages/NewPostPage';

function App() {
  return (
    <Router>
      <AuthStatus />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/new" element={<NewPostPage />} />
      </Routes>
    </Router>
  );
}

export default App;

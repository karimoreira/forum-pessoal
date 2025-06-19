import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NewPostPage from './pages/NewPostPage';
import PostPage from './pages/PostPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/new" element={<NewPostPage />} />
          <Route path="/post/:id" element={<PostPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Papa from 'papaparse';
import Header from './components/Header';
import SponsoredBanner from './components/SponsoredBanner';
import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import ContactPage from './pages/ContactPage';
import ProductPage from './components/ProductPage';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if user has a preference stored
    const savedMode = localStorage.getItem('darkMode');
    // Check system preference if no stored preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedMode ? savedMode === 'true' : prefersDark;
  });

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Update localStorage and apply class when dark mode changes
  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Parse URL parameters for category
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, []);

  return (
    <Router>
      <AppContent 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
    </Router>
  );
}

// Separate component to access useLocation inside Router
function AppContent({ searchTerm, setSearchTerm, activeCategory, setActiveCategory, isDarkMode, toggleDarkMode }) {
  const location = useLocation();
  
  // Update category from URL when location changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [location, setActiveCategory]);

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-[#f0f8ff] text-gray-900'}`}>
      <SponsoredBanner />
      <Header 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        setActiveCategory={setActiveCategory}
      />
      
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage searchTerm={searchTerm} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/tool/:toolName" element={<ProductPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      
      <Footer />
    </div>
  );
}

export default App;

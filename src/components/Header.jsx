import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Papa from 'papaparse';

function Header({ searchTerm, setSearchTerm, isDarkMode, toggleDarkMode, setActiveCategory }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState([
    'All', 'Productivity', 'Image Improvement', 'Research', 
    'Generative Art', 'Avatar', 'Marketing', 'Copywriting',
    'Chat', 'Gaming', 'Video Editing', 'Generative Code',
    'Prompt Guides', 'For Fun', 'Generative Video', 'Image Scanning',
    'Self-Improvement', 'Text-To-Speech', 'AI Detection', 'Speech-To-Text'
  ]);
  
  // Handle scroll effect for header
  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', controlNavbar);
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, []);

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  // Handle category selection
  const handleCategoryClick = (category) => {
    // Update active category in HomePage
    setActiveCategory(category);
    
    // Navigate to home page with category parameter
    navigate('/?category=' + encodeURIComponent(category));
    
    // Close dropdown and mobile menu
    setOpenDropdown(null);
    setIsMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.mobile-menu-container') && !event.target.closest('.mobile-menu-button')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    };
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Handle search input
  const handleSearchChange = (e) => {
    if (setSearchTerm) {
      setSearchTerm(e.target.value);
    }
  };

  // Reset filters when clicking on logo
  const handleLogoClick = () => {
    if (setActiveCategory) {
      setActiveCategory('All');
    }
    if (setSearchTerm) {
      setSearchTerm('');
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#111111]/95 backdrop-blur-sm shadow-md' 
          : 'bg-[#111111]'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2" 
            onClick={handleLogoClick}
          >
            <div className="text-blue-500 h-8 w-8">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
                <path d="M12 7L12 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M7.5 12H16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-xl font-bold text-blue-500">AIxplore</span>
          </Link>

          {/* Desktop Navigation - Moved to right */}
          <nav className="hidden md:flex items-center space-x-6">
            <div className="relative group">
              <button className="flex items-center text-gray-300 hover:text-white px-2 py-1 rounded-md transition-colors">
                AI Tools
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <Link to="/popular" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Popular Tools
                  </Link>
                  <Link to="/new" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    New Tools
                  </Link>
                  <Link to="/categories" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Categories
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative group">
              <button className="flex items-center text-gray-300 hover:text-white px-2 py-1 rounded-md transition-colors">
                AI Products
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <Link to="/news" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Latest News
                  </Link>
                  <Link to="/contact" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative group">
              <button className="flex items-center text-gray-300 hover:text-white px-2 py-1 rounded-md transition-colors">
                Submit and Promote
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <Link to="/submit" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Submit a Tool
                  </Link>
                  <Link to="/promote" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Promote Your Tool
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md">
              AI Tools
            </Link>
            <Link to="/news" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md">
              AI Products
            </Link>
            <Link to="/submit" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md">
              Submit and Promote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header; 
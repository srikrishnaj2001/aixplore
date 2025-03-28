import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import ToolCard from '../components/ToolCard';
import ProductPage from '../components/ProductPage';
import Pagination from '../components/Pagination';
import { cn } from '@/lib/utils';

function HomePage({ searchTerm, setSearchTerm, activeCategory, setActiveCategory }) {
  const [tools, setTools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [jumpToPage, setJumpToPage] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [sortBy, setSortBy] = useState('all'); // 'all', 'free', 'freemium', 'paid'
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '');
  const categoryBarRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const [categories, setCategories] = useState([
    'All', 'Productivity', 'Image Improvement', 'Research', 
    'Generative Art', 'Avatar', 'Marketing', 'Copywriting',
    'Chat', 'Gaming', 'Video Editing', 'Generative Code',
    'Prompt Guides', 'For Fun', 'Generative Video', 'Image Scanning',
    'Self-Improvement', 'Text-To-Speech', 'AI Detection', 'Speech-To-Text'
  ]);
  
  // Set default active category to "All" if not provided
  useEffect(() => {
    if (!activeCategory && setActiveCategory) {
      setActiveCategory('All');
    }
  }, [activeCategory, setActiveCategory]);
  
  // Set tools per page to 40
  const toolsPerPage = 40;

  // Update local search term when prop changes
  useEffect(() => {
    setLocalSearchTerm(searchTerm || '');
  }, [searchTerm]);

  // Handle search input with debounce
  const handleSearchInput = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set a new timeout to update the search after typing stops
    searchTimeoutRef.current = setTimeout(() => {
      if (setSearchTerm) {
        setSearchTerm(value);
      }
      setCurrentPage(1); // Reset to first page when searching
    }, 300); // 300ms debounce
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Fetch tools data
  useEffect(() => {
    const fetchTools = async () => {
      try {
        setIsLoading(true);
        
        // Fetch the CSV file
        const response = await fetch('/data.csv');
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            console.log("CSV data loaded:", results.data.length, "tools");
            
            // Map the CSV data to the expected format
            const parsedTools = results.data
              .filter(tool => tool.Title && tool.Description) // Filter out empty entries
              .map(tool => ({
                Name: tool.Title,
                Description: tool.Description,
                Categories: tool.Categories || '',
                URL: tool.Official_URL || '#',
                Pricing: tool.Pricing || 'Unknown',
                FutureTools_URL: tool.FutureTools_URL || '#'
              }));
            
            if (parsedTools.length > 0) {
              setTools(parsedTools);
              console.log("Parsed tools:", parsedTools.length);
            } else {
              // Fallback to dummy data if no valid tools found
              console.warn("No valid tools found in CSV, using dummy data");
              const dummyData = Array(40).fill().map((_, i) => ({
                Name: `AI Tool ${i+1}`,
                Description: `This is a description for AI Tool ${i+1}. It's a powerful tool for various AI tasks.`,
                Categories: ['Productivity', 'Research', 'Generative Art', 'Chat'][Math.floor(Math.random() * 4)],
                URL: '#',
                Pricing: ['Free', 'Freemium', 'Paid'][Math.floor(Math.random() * 3)]
              }));
              setTools(dummyData);
            }
            setIsLoading(false);
          },
          error: (error) => {
            console.error("CSV parsing error:", error);
            setError("Failed to parse CSV data");
            setIsLoading(false);
          }
        });
      } catch (error) {
        console.error("Fetch error:", error);
        setError("Failed to fetch tools data");
        setIsLoading(false);
      }
    };
    
    fetchTools();
  }, []);

  // Extract unique categories from tools data
  useEffect(() => {
    if (tools.length > 0) {
      const categorySet = new Set(['All']);
      tools.forEach(tool => {
        if (tool.Categories) {
          const cats = typeof tool.Categories === 'string' 
            ? tool.Categories.split(',') 
            : [tool.Categories];
          
          cats.forEach(cat => {
            if (cat && typeof cat === 'string') {
              categorySet.add(cat.trim());
            }
          });
        }
      });
      setCategories(Array.from(categorySet));
    }
  }, [tools]);

  // Handle category scroll
  useEffect(() => {
    const handleScroll = () => {
      if (categoryBarRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = categoryBarRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    const categoryBar = categoryBarRef.current;
    if (categoryBar) {
      categoryBar.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
    }

    return () => {
      if (categoryBar) {
        categoryBar.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Scroll category bar left/right
  const scrollCategories = (direction) => {
    if (categoryBarRef.current) {
      const scrollAmount = 200;
      const newScrollLeft = categoryBarRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      categoryBarRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Filter tools based on search term and pricing (search only matches title)
  const filteredTools = tools.filter(tool => {
    const matchesSearch = !localSearchTerm || 
      (tool.Name?.toLowerCase().includes(localSearchTerm.toLowerCase()));
    
    // Only apply category filter if there's no search term
    const matchesCategory = !localSearchTerm ? (
      activeCategory === 'All' || 
      (tool.Categories && (
        typeof tool.Categories === 'string' 
          ? tool.Categories.split(',').map(cat => cat.trim()).includes(activeCategory)
          : tool.Categories === activeCategory
      ))
    ) : true; // If there's a search term, ignore category filter
    
    const matchesPricing = sortBy === 'all' || 
      (tool.Pricing && tool.Pricing.toLowerCase() === sortBy.toLowerCase());
    
    return matchesSearch && matchesCategory && matchesPricing;
  });

  // Calculate total pages
  const totalPages = Math.ceil(filteredTools.length / toolsPerPage);
  
  // Ensure current page is valid
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages, sortBy, localSearchTerm]); // Added localSearchTerm dependency
  
  // Get current tools for the page
  const indexOfLastTool = currentPage * toolsPerPage;
  const indexOfFirstTool = indexOfLastTool - toolsPerPage;
  const currentTools = filteredTools.slice(indexOfFirstTool, indexOfLastTool);
  
  // Change page
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Handle jump to page
  const handleJumpToPage = (e) => {
    e.preventDefault();
    const pageNumber = parseInt(jumpToPage);
    if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= totalPages) {
      handlePageChange(pageNumber);
      setJumpToPage('');
    }
  };

  return (
    <div className="container mx-auto px-4 pt-20 pb-10">
      {/* Category Navigation */}
      <div className="relative mb-8">
        {showLeftArrow && (
          <button 
            onClick={() => scrollCategories('left')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Scroll categories left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        
        <div 
          ref={categoryBarRef}
          className="flex overflow-x-auto scrollbar-hide space-x-3 py-3 px-10 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setCurrentPage(1); // Reset to first page when changing category
              }}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors",
                activeCategory === category
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              )}
            >
              {category}
            </button>
          ))}
        </div>
        
        {showRightArrow && (
          <button 
            onClick={() => scrollCategories('right')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Scroll categories right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Header with Search and Filters in one line */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white whitespace-nowrap">
          {activeCategory === 'All' ? 'All Tools' : activeCategory}
        </h2>
        
        {/* Search Box */}
        <div className="flex-grow max-w-2xl w-full">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              value={localSearchTerm}
              onChange={handleSearchInput}
              placeholder="Search for AI tools by name or description..."
              className="block w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
          </div>
        </div>
        
        {/* Pricing Filter */}
        <div className="flex items-center whitespace-nowrap">
          <span className="mr-2 text-gray-700 dark:text-gray-300 text-sm font-medium">Filter by Pricing</span>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1); // Reset to first page when changing filter
            }}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          >
            <option value="all">All</option>
            <option value="free">Free</option>
            <option value="freemium">Freemium</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Loading AI tools...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-lg shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500 dark:text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-500 dark:text-red-400 text-lg font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {currentTools.length > 0 ? (
              currentTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))
            ) : (
              <div className="col-span-full text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-lg shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
                  No tools found
                </p>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Try adjusting your search, category, or pricing filter to find what you're looking for.
                </p>
                <button 
                  onClick={() => {
                    setActiveCategory('All');
                    setSortBy('all');
                    setLocalSearchTerm('');
                    if (setSearchTerm) setSearchTerm('');
                  }}
                  className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
          
          {/* Updated Pagination */}
          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}

export default HomePage; 
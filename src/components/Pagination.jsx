import React, { useState } from 'react';

function Pagination({ currentPage, totalPages, onPageChange }) {
  const [jumpToPage, setJumpToPage] = useState('');

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max to show
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      // Add ellipsis after first page if needed
      if (currentPage > 3) {
        pageNumbers.push('...');
      }
      
      // Add pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        if (i > 1 && i < totalPages) {
          pageNumbers.push(i);
        }
      }
      
      // Add ellipsis before last page if needed
      if (currentPage < totalPages - 2) {
        pageNumbers.push('...');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  // Handle jump to page form submission
  const handleJumpToPage = (e) => {
    e.preventDefault();
    const pageNum = parseInt(jumpToPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
      setJumpToPage('');
    }
  };

  return (
    <div className="mt-10 flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
      {/* Page info - only visible on mobile */}
      <div className="text-gray-600 dark:text-gray-300 sm:hidden">
        <span className="font-medium">Page {currentPage} of {totalPages}</span>
      </div>
      
      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            currentPage === 1
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          }`}
          aria-label="Go to first page"
        >
          First
        </button>
        
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            currentPage === 1
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          }`}
          aria-label="Go to previous page"
        >
          Previous
        </button>
        
        {/* Page numbers */}
        <div className="hidden md:flex items-center">
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-2 text-gray-500 dark:text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  onClick={() => typeof page === 'number' && onPageChange(page)}
                  className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-black text-white dark:bg-black dark:text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
                  aria-label={`Go to page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            currentPage === totalPages
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          aria-label="Go to next page"
        >
          Next
        </button>
        
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            currentPage === totalPages
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          aria-label="Go to last page"
        >
          Last
        </button>
      </div>
      
      {/* Jump to page form */}
      <div className="flex items-center">
        <form onSubmit={handleJumpToPage} className="flex items-center">
          <label htmlFor="jump-to-page" className="mr-2 text-gray-700 dark:text-gray-300 text-sm">
            Go to page:
          </label>
          <input
            id="jump-to-page"
            type="text"
            value={jumpToPage}
            onChange={(e) => setJumpToPage(e.target.value)}
            className="w-16 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Jump to page"
          />
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Go
          </button>
        </form>
      </div>
    </div>
  );
}

export default Pagination; 
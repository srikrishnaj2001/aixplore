import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Papa from 'papaparse';

function ProductPage() {
  const { toolName } = useParams();
  const navigate = useNavigate();
  const [tool, setTool] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchToolData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch the CSV file
        const response = await fetch('/data.csv');
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            // Find the tool with the matching name
            const decodedToolName = decodeURIComponent(toolName);
            const foundTool = results.data.find(
              item => item.Title && item.Title.toLowerCase() === decodedToolName.toLowerCase()
            );
            
            if (foundTool) {
              setTool({
                Name: foundTool.Title,
                Description: foundTool.Description,
                Categories: foundTool.Categories || '',
                URL: foundTool.Official_URL || '#',
                Pricing: foundTool.Pricing || 'Unknown',
                Features: foundTool.Features || '',
                FutureTools_URL: foundTool.FutureTools_URL || '#'
              });
            } else {
              setError("Tool not found");
            }
            setIsLoading(false);
          },
          error: (error) => {
            console.error("CSV parsing error:", error);
            setError("Failed to parse tool data");
            setIsLoading(false);
          }
        });
      } catch (error) {
        console.error("Fetch error:", error);
        setError("Failed to fetch tool data");
        setIsLoading(false);
      }
    };
    
    fetchToolData();
  }, [toolName]);

  // Handle the checkout button click
  const handleCheckout = () => {
    if (tool?.URL && tool.URL !== '#') {
      window.open(tool.URL, '_blank');
    }
  };

  // Generate a letter avatar if no image is available
  const getLetterAvatar = () => {
    const letterAvatar = tool?.Name ? tool.Name.charAt(0).toUpperCase() : 'A';
    const avatarColors = [
      'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-red-500', 
      'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500'
    ];
    return {
      letter: letterAvatar,
      color: avatarColors[letterAvatar.charCodeAt(0) % avatarColors.length]
    };
  };

  // Extract pricing information for display
  const getPricingClass = () => {
    if (!tool?.Pricing) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    
    const pricingLower = tool.Pricing.toLowerCase();
    if (pricingLower === 'free') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (pricingLower === 'freemium') return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    if (pricingLower === 'paid') return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-24">
        <div className="flex flex-col justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Loading tool details...</p>
        </div>
      </div>
    );
  }

  if (error || !tool) {
    return (
      <div className="container mx-auto px-4 py-8 mt-24">
        <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-lg shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500 dark:text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-500 dark:text-red-400 text-lg font-medium">{error || "Tool not found"}</p>
          <Link 
            to="/"
            className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back to Tools
          </Link>
        </div>
      </div>
    );
  }

  const avatar = getLetterAvatar();
  const pricingClass = getPricingClass();

  return (
    <div className="container mx-auto px-4 py-8 mt-24">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Header with back button */}
        <div className="flex items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <Link 
            to="/"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mr-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Tool Details</h1>
        </div>
        
        {/* Tool content */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Tool avatar/logo */}
            <div className="flex-shrink-0">
              <div className={`w-24 h-24 ${avatar.color} rounded-lg flex items-center justify-center text-white text-4xl font-bold`}>
                {avatar.letter}
              </div>
            </div>
            
            {/* Tool info */}
            <div className="flex-grow">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{tool.Name}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${pricingClass}`}>
                  {tool.Pricing}
                </span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {tool.Description}
              </p>
              
              {/* Categories */}
              {tool.Categories && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {(typeof tool.Categories === 'string' 
                      ? tool.Categories.split(',').map(cat => cat.trim())
                      : [tool.Categories]
                    ).map((category, index) => (
                      <span 
                        key={index} 
                        className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-sm"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Additional info if available */}
              {tool.Features && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Features</h3>
                  <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300">
                    {tool.Features.split(',').map((feature, index) => (
                      <li key={index}>{feature.trim()}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Checkout button */}
              <div className="mt-8">
                <button
                  onClick={handleCheckout}
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Check Out This Tool Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage; 
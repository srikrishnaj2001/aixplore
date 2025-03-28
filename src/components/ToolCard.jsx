import React from 'react';
import { useNavigate } from 'react-router-dom';

function ToolCard({ tool }) {
  const navigate = useNavigate();
  
  // Generate a letter avatar
  const letterAvatar = tool.Name ? tool.Name.charAt(0).toUpperCase() : 'A';
  const avatarColors = [
    'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-red-500', 
    'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500'
  ];
  const avatarColor = avatarColors[letterAvatar.charCodeAt(0) % avatarColors.length];

  // Determine pricing badge color
  const pricingClass = 
    tool.Pricing?.toLowerCase() === 'free' ? 'bg-green-100 text-green-800' :
    tool.Pricing?.toLowerCase() === 'freemium' ? 'bg-blue-100 text-blue-800' :
    'bg-purple-100 text-purple-800';
  
  // Get category (first one if multiple)
  const category = typeof tool.Categories === 'string' 
    ? tool.Categories.split(',')[0].trim() 
    : tool.Categories;
  
  const handleClick = () => {
    navigate(`/tool/${encodeURIComponent(tool.Name)}`);
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col"
      onClick={handleClick}
    >
      <div className="p-5 flex-grow">
        <div className="flex items-center mb-4">
          <div className={`w-10 h-10 ${avatarColor} rounded-md flex items-center justify-center text-white font-bold mr-3`}>
            {letterAvatar}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{tool.Name}</h3>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {tool.Description}
        </p>
      </div>
      
      <div className="px-5 pb-5 pt-2 mt-auto flex items-center justify-between border-t border-gray-100 dark:border-gray-700">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${pricingClass}`}>
          {tool.Pricing || 'Unknown'}
        </span>
        
        {category && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {category}
          </span>
        )}
      </div>
    </div>
  );
}

export default ToolCard; 
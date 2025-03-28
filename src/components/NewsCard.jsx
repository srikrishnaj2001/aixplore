import React, { useState, useEffect } from 'react';

// Array of default AI-related images to use when no image is provided
const DEFAULT_AI_IMAGES = [
  "https://images.unsplash.com/photo-1677442135968-6bd241f40c8a?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1677741447637-d3d38553a9b1?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1684391445107-3c04f9f05c5a?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1673187236223-8dfe6b6e9b29?q=80&w=500&auto=format&fit=crop"
];

function NewsCard({ article }) {
  const { title, description, source, date, imageUrl, url } = article;
  const [imgSrc, setImgSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get a default image based on the article ID for consistency
  const getDefaultImage = () => {
    const index = article.id % DEFAULT_AI_IMAGES.length;
    return DEFAULT_AI_IMAGES[index];
  };
  
  // Handle image loading error
  const handleImageError = () => {
    setImgSrc(getDefaultImage());
    setIsLoading(false);
  };
  
  // Handle successful image load
  const handleImageLoad = () => {
    setIsLoading(false);
  };
  
  // Check if the image URL is valid
  const isValidImageUrl = (url) => {
    return url && 
           url.startsWith('http') && 
           !url.includes('data:image/') &&
           !url.includes('base64');
  };
  
  // Set the image source on component mount or when imageUrl changes
  useEffect(() => {
    if (isValidImageUrl(imageUrl)) {
      setImgSrc(imageUrl);
    } else {
      setImgSrc(getDefaultImage());
    }
  }, [imageUrl]);
  
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="h-48 overflow-hidden bg-gray-100 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img 
          src={imgSrc || getDefaultImage()}
          alt={title}
          onError={handleImageError}
          onLoad={handleImageLoad}
          className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-blue-600">{source}</span>
          <span className="text-xs text-gray-500">{date}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
      </div>
    </a>
  );
}

export default NewsCard; 
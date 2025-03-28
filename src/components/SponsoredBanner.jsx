import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

function SponsoredBanner() {
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Add scroll event listener with improved smoothness and direction detection
  useEffect(() => {
    const controlBanner = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY <= 5) {
        // At the very top of the page
        setScrolled(false);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setScrolled(true);
      } else if (currentScrollY < lastScrollY && currentScrollY < 80) {
        // Scrolling up and near the top
        setScrolled(false);
      }
      
      // Update last scroll position
      setLastScrollY(currentScrollY);
    };

    // Add event listener with throttling
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          controlBanner();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);
  
  return (
    <div 
      className={cn(
        "fixed top-0 left-0 right-0 bg-indigo-100 dark:bg-indigo-950 py-2.5 text-center z-50 border-b border-indigo-200 dark:border-indigo-900 will-change-transform will-change-opacity",
        scrolled ? "opacity-0 -translate-y-full" : "opacity-100 translate-y-0"
      )}
      style={{ 
        transition: 'transform 0.25s cubic-bezier(0.33, 1, 0.68, 1), opacity 0.25s cubic-bezier(0.33, 1, 0.68, 1)' 
      }}
    >
      <div className="container mx-auto px-4 flex flex-wrap items-center justify-center">
        <span className="text-gray-600 dark:text-gray-400 mr-2 text-sm font-medium">Sponsored by</span>
        <span className="font-semibold bg-black text-white px-2.5 py-0.5 rounded-md mr-2 text-sm tracking-wide">Powered_By</span>
        <span className="text-gray-500 dark:text-gray-500 mx-2">|</span>
        <span className="text-gray-700 dark:text-gray-300 text-sm">Custom AI agents tailored for small and medium-sized businesses.</span>
        <a 
          href="https://powered-by.ai" 
          target="_blank" 
          rel="noopener noreferrer"
          className="ml-2 inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
          aria-label="Learn more about Powered_By"
        >
          <ArrowRight size={18} className="ml-1" />
        </a>
      </div>
    </div>
  );
}

export default SponsoredBanner; 
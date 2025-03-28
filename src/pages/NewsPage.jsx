import React, { useState, useEffect } from 'react';
import NewsCard from '../components/NewsCard';

function NewsPage() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        // In a production environment, you would use an environment variable for the API key
        // and make the request from your backend to avoid exposing the key
        const API_KEY = 'e8f8201e89b24aa48f9c1fd9e6540f8d'; // Replace with your actual NewsAPI key
        
        // Fetch AI-related news from multiple sources
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=artificial+intelligence&sortBy=publishedAt&language=en&pageSize=20&apiKey=${API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error(`News API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'ok' && data.articles) {
          // Transform the API response to match our article format
          const formattedNews = data.articles.map((article, index) => ({
            id: index + 1,
            title: article.title || 'Untitled Article',
            description: article.description || 'No description available',
            source: article.source.name || 'Unknown Source',
            date: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Unknown Date',
            imageUrl: article.urlToImage || 'https://plus.unsplash.com/premium_photo-1683121710572-7723bd2e235d?q=80&w=3732&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Set to null if not available
            url: article.url
          }));
          
          setNews(formattedNews);
        } else {
          throw new Error(data.message || 'Failed to fetch news articles');
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching news:", err);
        
        // For demo purposes, fall back to mock data if the API request fails
        // In a production app, you might want to show the error instead
        const mockNews = [
          {
            id: 1,
            title: "OpenAI Announces GPT-5 with Enhanced Reasoning Capabilities",
            description: "The latest model shows significant improvements in logical reasoning and problem-solving abilities.",
            source: "OpenAI Blog",
            date: "2023-06-15",
            imageUrl: "https://images.unsplash.com/photo-1677442135968-6bd241f40c8a?q=80&w=500&auto=format&fit=crop",
            url: "https://openai.com/blog/"
          },
          {
            id: 2,
            title: "Google DeepMind Achieves Breakthrough in Protein Folding",
            description: "New AI system can predict protein structures with unprecedented accuracy, potentially revolutionizing drug discovery.",
            source: "Google AI Blog",
            date: "2023-06-14",
            imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=500&auto=format&fit=crop",
            url: "https://blog.google/technology/ai/"
          },
          {
            id: 3,
            title: "AI Ethics Researchers Call for New Regulatory Framework",
            description: "Leading AI researchers propose comprehensive guidelines for responsible AI development and deployment.",
            source: "MIT Technology Review",
            date: "2023-06-13",
            imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=500&auto=format&fit=crop",
            url: "https://www.technologyreview.com/"
          },
          {
            id: 4,
            title: "Microsoft Integrates AI Assistants Across Office Suite",
            description: "New AI features in Microsoft 365 aim to boost productivity and creativity for users.",
            source: "Microsoft AI Blog",
            date: "2023-06-12",
            imageUrl: "https://images.unsplash.com/photo-1661961110671-77b71b929d52?q=80&w=500&auto=format&fit=crop",
            url: "https://blogs.microsoft.com/ai/"
          },
          {
            id: 5,
            title: "AI-Generated Art Wins Major Competition, Sparks Controversy",
            description: "Digital artwork created using AI tools takes first prize, raising questions about creativity and authorship.",
            source: "Wired",
            date: "2023-06-11",
            imageUrl: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=500&auto=format&fit=crop",
            url: "https://www.wired.com/"
          },
          {
            id: 6,
            title: "New Research Shows AI Can Detect Early Signs of Alzheimer's",
            description: "Machine learning algorithm identifies subtle patterns in brain scans that human doctors might miss.",
            source: "Nature",
            date: "2023-06-10",
            imageUrl: "https://images.unsplash.com/photo-1559757175-7cb057fba93c?q=80&w=500&auto=format&fit=crop",
            url: "https://www.nature.com/"
          },
          {
            id: 7,
            title: "Tesla Unveils New Self-Driving Features Powered by Custom AI Chip",
            description: "Latest update brings enhanced navigation and obstacle detection capabilities to Tesla vehicles.",
            source: "Tesla Blog",
            date: "2023-06-09",
            imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=500&auto=format&fit=crop",
            url: "https://www.tesla.com/blog"
          },
          {
            id: 8,
            title: "AI Startup Raises Record $500M for Language Model Development",
            description: "New funding round aims to create more efficient and capable language models for enterprise applications.",
            source: "TechCrunch",
            date: "2023-06-08",
            imageUrl: "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=500&auto=format&fit=crop",
            url: "https://techcrunch.com/"
          },
          {
            id: 9,
            title: "Meta's AI Translation System Now Supports 200 Languages",
            description: "Breakthrough model can translate between languages that previously had limited digital resources.",
            source: "Meta AI Research",
            date: "2023-06-07",
            imageUrl: "https://images.unsplash.com/photo-1546146830-2cca9512c68e?q=80&w=500&auto=format&fit=crop",
            url: "https://ai.facebook.com/"
          },
          {
            id: 10,
            title: "New AI Tool Can Generate 3D Models from Text Descriptions",
            description: "Researchers develop system that creates detailed 3D assets based on natural language prompts.",
            source: "NVIDIA Research",
            date: "2023-06-06",
            imageUrl: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=500&auto=format&fit=crop",
            url: "https://www.nvidia.com/en-us/research/"
          },
          {
            id: 11,
            title: "AI-Powered Drone System Helps Monitor Endangered Wildlife",
            description: "Conservation efforts boosted by automated aerial surveillance and image recognition technology.",
            source: "National Geographic",
            date: "2023-06-05",
            imageUrl: "https://images.unsplash.com/photo-1567722681579-c671cabd2810?q=80&w=500&auto=format&fit=crop",
            url: "https://www.nationalgeographic.com/"
          },
          {
            id: 12,
            title: "IBM Quantum Computing Breakthrough Enabled by AI Algorithms",
            description: "New approach uses machine learning to optimize quantum circuits and reduce error rates.",
            source: "IBM Research",
            date: "2023-06-04",
            imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=500&auto=format&fit=crop",
            url: "https://research.ibm.com/"
          }
        ];
        
        setNews(mockNews);
        setError("Using sample data: " + err.message);
        setIsLoading(false);
      }
    };

    fetchNews();
    
    // Set up a daily refresh interval
    const refreshInterval = setInterval(fetchNews, 24 * 60 * 60 * 1000); // 24 hours
    
    return () => clearInterval(refreshInterval);
  }, []);

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">AIxplore News</h1>
      <p className="text-center text-gray-600 mb-8">Stay updated with the latest developments in AI</p>
      
      {error && (
        <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded-md text-sm text-center">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-md h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : news.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No news articles found. Please try again later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {news.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

export default NewsPage; 
import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

const HomePage = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Environment:', import.meta.env.MODE);
        console.log('Base URL:', import.meta.env.BASE_URL);
        console.log('Data URL:', '/data.csv');
        console.log('Loading CSV data...');
        const response = await fetch('/data.csv');
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            console.log('Parsed CSV data:', results.data);
            setTools(results.data);
            setLoading(false);
          },
          error: (error) => {
            console.error('CSV parsing error:', error);
            setError(error);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('Error loading CSV:', error);
        setError(error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data: {error.message}</div>;
  if (!tools.length) return <div>No tools found</div>;

  return (
    <div>
      {/* Render your component content here */}
    </div>
  );
};

export default HomePage; 
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF?: number; // опциональное поле
  summary: string;
}

const ApiTest: React.FC = () => {
  const [data, setData] = useState<WeatherForecast[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get<WeatherForecast[]>('http://localhost:5218/api/WeatherForecast')
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching data:', err);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h3>Weather Forecast Data from API</h3>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            Date: {item.date}, Temp: {item.temperatureC}C, Summary: {item.summary}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApiTest;
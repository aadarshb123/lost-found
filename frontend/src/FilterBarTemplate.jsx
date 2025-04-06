import React, { useState, useEffect } from 'react';
import FilterBar from './FilterBar';
import './index.css';

const App = () => {
  const [filters, setFilters] = useState({
    status: '',
    itemType: '',
  });
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.itemType) queryParams.append('itemType', filters.itemType);
      
      const response = await fetch(`http://localhost:5001/getItems?${queryParams.toString()}`);
      const data = await response.json();
      setItems(data.items);
    } catch (error) {
      console.error('Error fetching items: ', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [filters]);

  const handleFilterChange = ({ filter, value }) => {
    setFilters(prev => ({ ...prev, [filter]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Box with a Georgia Tech styled border (using gold or a custom color) */}
      <div className="w-full max-w-4xl p-8 bg-white rounded shadow-lg border-4 border-[#B3A369]">
        <h1 className="text-4xl font-bold text-[#00285E] mb-6 text-center">
          Lost and Found Items
        </h1>
        <FilterBar onFilterChange={handleFilterChange} />
        <div className="mt-6">
          {items.map(item => (
            <div key={item._id} className="border border-gray-300 p-4 mb-4 rounded shadow-sm text-left">
              <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
              <p className="mb-1">{item.description}</p>
              <p className="mb-1">Status: {item.status}</p>
              <p className="mb-1">Type: {item.itemType}</p>
              <p className="mb-1">Location: {item.location}</p>
              <p className="mb-1">
                Date Lost: {item.dateLost ? new Date(item.dateLost).toLocaleDateString() : "N/A"}
              </p>
              <p>
                Date Found: {item.dateFound ? new Date(item.dateFound).toLocaleDateString() : "N/A"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
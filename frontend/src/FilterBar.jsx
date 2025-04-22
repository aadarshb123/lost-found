import React, { useState } from "react";
import "./FilterBar.css";

const FilterBar = ({ onFilterChange }) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleStatusChange = (e) => {
    onFilterChange({ filter: "status", value: e.target.value });
  };

  const handleItemTypeChange = (e) => {
    onFilterChange({ filter: "itemType", value: e.target.value });
  };

  const handleSearchChange = (e) => {
    onFilterChange({ filter: "search", value: e.target.value });
  };


  return (
    <div className="filter-bar">
      {/* Search bar */}
      <input
        type="text"
        placeholder="Search lost & found items..."
        onChange={handleSearchChange}
        className="search-input"
      />

      {/* Filter toggle button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="filter-button"
        aria-label="Toggle Filters"
      ></button>

      {/* Filter dropdown */}
      <div className={`filter-dropdown ${showFilters ? "show" : ""}`}>
        <div className="filter-column">
          <label>Status</label>
          <select onChange={handleStatusChange}>
            <option value="">All</option>

            <option value="lost">Lost</option>
            <option value="found">Found</option>
            <option value="claimed">Claimed</option>
          </select>

        </div>

        <div className="filter-column">
          <label>Item Type</label>
          <select onChange={handleItemTypeChange}>
            <option value="">All</option>

            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="personal">Personal</option>
            <option value="other">Other</option>
          </select>

        </div>
      </div>
    </div>
  );
};

export default FilterBar;

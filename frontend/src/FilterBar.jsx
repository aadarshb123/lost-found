import React from "react";
import "./FilterBar.css";

/*
onFilterChange is a callback function passed as a prop to the FilterBar component. 
Its purpose is to notify the parent component whenever the user selects a new filter option,
allowing the parent to update its state and adjust the displayed data accordingly.
*/
const FilterBar = ({ onFilterChange }) => {
    /*
    Tailwind CSS includes pre-built classes which allow you to build quickly.
    */
    return (
      <div className="flex gap-4 justify-center mb-4">
        <select
          onChange={(e) => onFilterChange({ filter: 'status', value: e.target.value })}
          className="w-40 p-2 rounded border border-gray-300 text-lg"
        >
          <option value="">All Statuses</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
          <option value="claimed">Claimed</option>
        </select>
        <select
          onChange={(e) => onFilterChange({ filter: 'itemType', value: e.target.value })}
          className="w-40 p-2 rounded border border-gray-300 text-lg"
        >
          <option value="">All Item Types</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="personal">Personal</option>
          <option value="other">Other</option>
        </select>
      </div>
    );
}
export default FilterBar;
// This code defines a FilterBar component that allows users to filter items based on their status and type.
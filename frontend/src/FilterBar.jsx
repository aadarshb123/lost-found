import React from "react";

/*
onFilterChange is a callback function passed as a prop to the FilterBar component. 
Its purpose is to notify the parent component whenever the user selects a new filter option,
allowing the parent to update its state and adjust the displayed data accordingly.
*/
const FilterBar = ({ onFilterChange }) => {

    /*
    The handleStatusChange is an event handler. It listens to changes in the status filter (e.g., "lost", "found", "claimed").
    onFilterChange is called after detecting a change. It sends an object containing the new status (e.target.value) back to parent.
    The parent is Home.jsx or the component that uses FilterBar.
    */
    const handleStatusChange = (e) => {
        onFilterChange({ filter: "status", value: e.target.value });
    };

    /*
    The handleStatusChange is an event handler. It listens to changes in the item filter.
    onFilterChange is called after detecting a change. It sends an object containing the new itemType (e.target.value) back to parent.
    */
    const handleItemTypeChange = (e) => {
        onFilterChange({ filter: "itemType", value: e.target.value });
    };

    const handleSearchChange = (e) => {
        onFilterChange({ filter: "search", value: e.target.value });
    };

    /*
    Tailwind CSS includes pre-built classes which allow you to build quickly.
    */
    return (
        <div className="flex items-center gap-4 w-full">
          {/* Status dropdown */}
          <select
            onChange={handleStatusChange}
            className="h-10 px-3 bg-gray-50 border-2 border-[#003057] rounded-lg
                     text-[#003057] font-medium text-sm
                     focus:outline-none focus:border-[#B3A369] focus:ring-2 focus:ring-[#B3A369]/30
                     focus:bg-white cursor-pointer hover:border-[#B3A369]
                     transition-all duration-200 w-[130px]"
          >
            <option value="">All Statuses</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
            <option value="claimed">Claimed</option>
          </select>
    
          {/* Item type dropdown */}
          <select
            onChange={handleItemTypeChange}
            className="h-10 px-3 bg-gray-50 border-2 border-[#003057] rounded-lg
                     text-[#003057] font-medium text-sm
                     focus:outline-none focus:border-[#B3A369] focus:ring-2 focus:ring-[#B3A369]/30
                     focus:bg-white cursor-pointer hover:border-[#B3A369]
                     transition-all duration-200 w-[140px]"
          >
            <option value="">All Item Types</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="personal">Personal</option>
            <option value="other">Other</option>
          </select>

          {/* Search bar */}
          <input
            type="text"
            placeholder="Search lost & found items..."
            onChange={handleSearchChange}
            className="flex-1 h-10 px-4 bg-gray-50 border-2 border-[#003057] rounded-lg 
                     text-[#003057] placeholder-gray-400 text-sm
                     focus:outline-none focus:border-[#B3A369] focus:ring-2 focus:ring-[#B3A369]/30
                     focus:bg-white transition-all duration-200"
          />
        </div>
    );
}

export default FilterBar;
// This code defines a FilterBar component that allows users to filter items based on their status and type.
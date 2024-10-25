import React from 'react';

export const SearchBar = ({ searchTerm, setSearchTerm }) => {
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="search-bar">
      <input 
        type="text" 
        placeholder="Search by username or character name..." 
        value={searchTerm}
        onChange={handleInputChange} 
      />
    </div>
  );
};

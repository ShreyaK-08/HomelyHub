import React, { useEffect, useState } from "react";
import FilterModal from "./FilterModal";

///dynamic//////////
import { useDispatch } from "react-redux";
import { propertyAction } from "../../store/Property/property-slice";
import { getAllProperties } from "../../store/Property/property-action";

const Filter = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});
  const dispatch = useDispatch();

  const handleShowAllPhotos = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleApplyFilters = (filters) => {
    setSelectedFilters(filters);
    dispatch(
      propertyAction.updateSearchParams({
        ...filters,
        page: 1,
      })
    );
    dispatch(getAllProperties());
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
    dispatch(propertyAction.resetFilters());
    dispatch(getAllProperties());
  };

  const handleFilterChange = (filterName, value) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  return (
    <>
      <span
        className="material-symbols-outlined filter"
        title="Filter properties"
        onClick={handleShowAllPhotos}
      >
        tune
      </span>
      {isModalOpen && (
        <FilterModal
          selectedFilters={selectedFilters}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
          onFilterChange={handleFilterChange}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default Filter;

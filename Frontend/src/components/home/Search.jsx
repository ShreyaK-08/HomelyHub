import React, { useState } from "react";
import { DatePicker, Space } from "antd";
import "react-datepicker/dist/react-datepicker.css";
import "../../css/Home.css";

import { useDispatch } from "react-redux";
import { propertyAction } from "../../store/Property/property-slice";
import { getAllProperties } from "../../store/Property/property-action";

const Search = () => {
  const { RangePicker } = DatePicker;
  const [keyword, setKeyword] = useState({
    city: "",
    guests: "",
    dateIn: "",
    dateOut: "",
  });
  const [value, setValue] = useState([]);

  const dispatch = useDispatch();

  function searchHandler(e) {
    if (e) e.preventDefault();
    const cleanParams = {
      city: keyword.city ? keyword.city.trim() : "",
      guests: keyword.guests ? Number(keyword.guests) : "",
      dateIn: keyword.dateIn || "",
      dateOut: keyword.dateOut || "",
      page: 1,
    };
    dispatch(propertyAction.updateSearchParams(cleanParams));
    dispatch(getAllProperties());
  }

  function returnDates(date, dateString) {
    if (date && date.length === 2 && date[0] && date[1]) {
      setValue([date[0], date[1]]);
      updateKeyword("dateIn", dateString[0]);
      updateKeyword("dateOut", dateString[1]);
    } else {
      setValue([]);
      updateKeyword("dateIn", "");
      updateKeyword("dateOut", "");
    }
  }

  const updateKeyword = (field, val) => {
    setKeyword((prevKeyword) => ({
      ...prevKeyword,
      [field]: val,
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchHandler(e);
    }
  };

  return (
    <>
      <div className="searchbar">
        <input
          className="search"
          id="search_destination"
          placeholder="Search destinations"
          type="text"
          value={keyword.city || ""}
          onChange={(e) => updateKeyword("city", e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Space direction="vertical" size={12}>
          <RangePicker
            value={value}
            format="DD-MM-YYYY"
            picker="date"
            className="date_picker"
            disabledDate={(current) => {
              return current && current.isBefore(Date.now(), "day");
            }}
            onChange={returnDates}
          />
        </Space>
        <input
          className="search"
          id="addguest"
          placeholder="Add guests"
          type="number"
          min="1"
          value={keyword.guests || ""}
          onChange={(e) =>
            updateKeyword("guests", e.target.value ? Number(e.target.value) : "")
          }
          onKeyDown={handleKeyDown}
        />
        <span
          className="material-symbols-outlined searchicon"
          title="Search"
          onClick={searchHandler}
        >
          search
        </span>
      </div>
    </>
  );
};

export default Search;

import React from "react";
import { Dropdown } from "primereact/dropdown";
import { rangeOptions } from "../../utils/DateRangeUtil";

const DateRangeSelector = ({ value, onChange, className = "w-40" }) => {
  return (
    <Dropdown
      value={value}
      options={rangeOptions}
      onChange={(e) => onChange(e.value)}
      placeholder="Select Range"
      className={className}
    />
  );
};

export default DateRangeSelector;

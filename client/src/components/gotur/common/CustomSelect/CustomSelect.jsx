import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";

const CustomSelect = ({ options = [], placeholder = "Select...", onChange }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (value) => {
    const option = options.find((opt) => opt.value === value);
    if (option) {
      setSelected(option);
      onChange && onChange(option.value);
    }
  };

  return (
    <div className="custom-select">
      <Dropdown onSelect={handleSelect}>
        <Dropdown.Toggle
          variant="light"
          className="custom-select__toggle"
        >
          {selected ? selected.label : placeholder}
        </Dropdown.Toggle>

        <Dropdown.Menu className="custom-select__menu w-100">
          {options.map((option) => (
            <Dropdown.Item
              key={option.value}
              eventKey={option.value}
              className="custom-select__option"
            >
              {option.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default CustomSelect;

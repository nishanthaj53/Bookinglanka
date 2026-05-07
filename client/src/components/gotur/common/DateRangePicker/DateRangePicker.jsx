"use client";

import React from "react";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "./DateRangePicker.css";

dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const dateFormat = "DD MMM YY";

const DateRangePicker = ({ dateRange, setDateRange }) => {
  return (
    <Space direction="vertical" size={12}>
      <RangePicker
        className="custom-range-picker"
        value={dateRange}
        onChange={(values) => {
          if (values) {
            setDateRange(values);
          }
        }}
        format={dateFormat}
        placeholder={["Start", "End"]}
      />
    </Space>
  );
};

export default DateRangePicker;


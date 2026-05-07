import React, { useState } from "react";
import dayjs from "dayjs";

import CustomSelect from "../../common/CustomSelect/CustomSelect";
import DateRangePicker from "../../common/DateRangePicker/DateRangePicker";
import { tourListingOneLeftData } from "../../../../data/tourListingOneLeftData";

const BannerForm = () => {
  const [location, setLocation] = useState(null);
  const [activity, setActivity] = useState(null);
  const [guests, setGuests] = useState(2);
  const [dateRange, setDateRange] = useState([dayjs(), dayjs()]);

  const incrementGuests = () => setGuests((g) => g + 1);
  const decrementGuests = () => guests > 1 && setGuests((g) => g - 1);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      location,
      activity,
      guests,
      dateRange,
    };

    console.log("Banner search data:", data);
  };

  return (
    <div
      className="banner-form wow fadeInUp"
      data-wow-duration="1500ms"
      data-wow-delay="300ms"
    >
      <div className="container">
        <form className="banner-form__wrapper" onSubmit={handleSubmit}>
          <div className="banner-form row gutter-x-30 align-items-center">
            {/* LOCATION */}
            <div className="banner-form__control banner-form__col--1">
              <i className="icon icon-location"></i>
              <label>Location</label>
              <CustomSelect
                options={tourListingOneLeftData.locations}
                placeholder="Australia"
                onChange={setLocation}
              />
            </div>

            {/* ACTIVITY */}
            <div className="banner-form__control banner-form__col--2">
              <i className="icon icon-travle"></i>
              <label>Activities Type</label>
              <CustomSelect
                options={tourListingOneLeftData.activities}
                placeholder="Adventure"
                onChange={setActivity}
              />
            </div>

            {/* DATE */}
            <div className="banner-form__control banner-form__control--date banner-form__col--3">
              <i className="icon icon-clock"></i>
              <label>Activate Day</label>
              <DateRangePicker
                dateRange={dateRange}
                setDateRange={setDateRange}
              />
            </div>

            {/* GUESTS */}
            <div className="banner-form__control banner-form__col--4">
              <i className="icon icon-group"></i>
              <label>Traveler</label>

              <button
                type="button"
                className="banner-form__qty-minus sub"
                onClick={decrementGuests}
              >
                <i className="icon-down-arrow"></i>
              </button>

              <input
                type="number"
                value={guests}
                readOnly
              />

              <button
                type="button"
                className="banner-form__qty-plus add"
                onClick={incrementGuests}
              >
                <i className="icon-down-arrow"></i>
              </button>
            </div>

            {/* SUBMIT */}
            <div className="banner-form__control banner-form__button banner-form__col--5">
              <button className="gotur-btn" type="submit">
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BannerForm;

import React, { useState, useContext, useEffect } from "react";

import TourCalculation from "./tourCalculation/TourCalculation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AppContext } from "../../pages/tours_lists/Tours_list";

const Form = () => {
  const { setSaveTour, editingTour, editMode } = useContext(AppContext);
  const [tourInfo, setTourInfo] = useState({
    startDate: new Date().getTime(),
    endDate: new Date().getTime(),
    guestNumber: 0,
  });

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    weChat: "",
  });

  useEffect(() => {
    if (editMode) {
      setCustomerInfo(editingTour.customerInfo);
      setTourInfo(editingTour.tourInfo);
    }
  }, [editMode]);

  useEffect(() => {
    setSaveTour((prev) => ({ ...prev, customerInfo: customerInfo }));
    setSaveTour((prev) => ({ ...prev, tourInfo: tourInfo }));
  }, [customerInfo, tourInfo]);

  const handleChangeCustomer = (e) => {
    let copy = { ...customerInfo };
    copy[e.target.name] = e.target.value;
    setCustomerInfo(copy);
  };

  const handleChangeTour = (value, name) => {
    let copy = { ...tourInfo };
    name == "guestNumber"
      ? (copy[name] = value)
      : (copy[name] = value.getTime());

    setTourInfo(copy);
  };

  return (
    <>
      <div className="customer-info">
        <h3>Customer info</h3>
        <p>
          Name:
          <input
            className={!customerInfo.name ? "required" : ""}
            value={customerInfo.name}
            name="name"
            placeholder="Customer name"
            onChange={(e) => handleChangeCustomer(e)}
          />
        </p>
        <p>
          Email:
          <input
            value={customerInfo.email}
            placeholder="Email"
            name="email"
            onChange={(e) => handleChangeCustomer(e)}
          />
        </p>
        <p>
          Phone:
          <input
            value={customerInfo.phone}
            placeholder="Phone"
            name="phone"
            onChange={(e) => handleChangeCustomer(e)}
          />
        </p>
        <p>
          WeChat:
          <input
            value={customerInfo.weChat}
            placeholder="WeChat"
            name="weChat"
            onChange={(e) => handleChangeCustomer(e)}
          />
        </p>
      </div>
      <div className="horizontal-line"></div>
      <div className="tour-info">
        <h3>Tour info</h3>
        <span>
          Starting date:
          <DatePicker
            onChange={(value) => handleChangeTour(value, "startDate")}
            selected={tourInfo.startDate}
          />
        </span>
        <span>
          Ending date:
          <DatePicker
            selected={tourInfo.endDate}
            onChange={(value) => handleChangeTour(value, "endDate")}
          />
        </span>
        <span>
          Guest number:
          <input
            type="number"
            value={tourInfo.guestNumber}
            min="0"
            max="1000"
            placeholder="Enter number"
            onChange={(value) =>
              handleChangeTour(value.target.value, "guestNumber")
            }
          />
        </span>
      </div>

      <TourCalculation />
    </>
  );
};

export default Form;

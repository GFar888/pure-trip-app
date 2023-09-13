import "./addTour.scss";
import React, { useState, useContext, useEffect } from "react";
import TourInfo from "./TourInfo";
import Select from "react-select";
import { status } from "./status_data";
import { db } from "../../config/firebase";
import { setDoc, doc } from "firebase/firestore";
import { AppContext } from "../../pages/tours_lists/Tours_list";
import timestampToDate from "../../utils/timestampToDate";
import Swal from "sweetalert2";

const AddTour = ({ openAddTour, idAndTime }) => {
  const { saveTour, setSaveTour, editingTour, setEditMode, editMode } =
    useContext(AppContext);

  const [selectedStatus, setSelectedStatus] = useState(2);

  useEffect(() => {
    setSaveTour((prev) => ({ ...prev, status: selectedStatus }));
  }, [selectedStatus]);

  useEffect(() => {
    if (editMode) {
      setSelectedStatus(editingTour.status);
    }
  }, [editMode]);

  const options = [
    { value: 1, label: "Approved" },
    { value: 2, label: "In Progress" },
    { value: 3, label: "Canceled" },
  ];

  const save = async () => {
    if (!saveTour.customerInfo.name) {
      return;
    }
    Swal.showLoading();
    await setDoc(doc(db, "allTours", idAndTime.tourId), saveTour);
    Swal.hideLoading();

    openAddTour(false);
    setEditMode(false);
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      iconColor: "#7364ff",
    });

    Toast.fire({
      icon: "success",
      title: editMode ? "Changes Saved" : "New Tour Added",
    });
  };

  return (
    <div className="add-tour-container">
      <div className="add-tour-header">
        <h1>Add Tour</h1>
        <div>
          <button
            className="cancel-btn"
            onClick={() => (openAddTour(false), setEditMode(false))}
          >
            Cancel
          </button>
          <button className="save-btn" onClick={save}>
            Save
          </button>
        </div>
      </div>

      <div className="form-wrapper">
        <div className="form-header">
          <div className="left-block">
            <h3>Tour ID: #{idAndTime.tourId}</h3>
            <p>{timestampToDate(idAndTime.createDate)}</p>

            {status.map((elm) => {
              return elm.value == selectedStatus ? (
                <span
                  key={elm.value}
                  style={{
                    color: `${elm.text_color}`,
                    backgroundColor: `${elm.label_color}`,
                  }}
                  className="tour-status"
                >
                  {elm.label}
                </span>
              ) : (
                ""
              );
            })}
          </div>

          <div className="right-block">
            <Select
              placeholder="Select Status..."
              defaultValue={
                editMode ? options[editingTour.status - 1] : options[1]
              }
              options={options}
              onChange={(e) => setSelectedStatus(e.value)}
            />
            <button className="download-btn">Download info</button>
          </div>
        </div>
        <TourInfo />
      </div>
    </div>
  );
};

export default AddTour;

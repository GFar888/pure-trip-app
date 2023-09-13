import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import { Table_data } from "./Tables_data";
import { AppContext } from "../../../pages/tours_lists/Tours_list";

const Hotels = () => {
  const [rowId, setRowId] = useState(1);
  const [enteredData, setEnteredData] = useState([
    {
      id: 1,
      title: "",
      roomType: "",
      roomQty: "",
      nights: "",
      nightPrice: "",
      sum: 0,
    },
  ]);

  const { setTotals, setSaveTour, editingTour, editMode } =
    useContext(AppContext);
  const [totalSum, setTotalSum] = useState(
    editMode
      ? editingTour.calculation.hotels.reduce((prev, current) => {
          return prev + current.sum;
        }, 0)
      : 0
  );

  useEffect(() => {
    if (editMode) {
      setEnteredData(editingTour.calculation.hotels);
      let copy = [...editingTour.calculation.hotels];

      setRowId(copy.length);
    }
  }, []);

  useEffect(() => {
    setTotals((prev) => ({ ...prev, hotels: totalSum }));
  }, [totalSum]);

  useEffect(() => {
    setSaveTour((prev) => ({
      ...prev,
      calculation: { ...prev.calculation, hotels: enteredData },
    }));
  }, [enteredData]);

  // ADD A NEW ROW
  const addRow = () => {
    const newId = rowId + 1;
    setRowId(newId);

    const copyEntered = [...enteredData];
    const newRow = {
      id: newId,
      title: "",
      roomType: "",
      roomQty: "",
      nights: "",
      nightPrice: "",
      sum: 0,
    };
    copyEntered.push(newRow);
    setEnteredData(copyEntered);
  };

  // DELETE ROW
  const deleteRow = () => {
    if (rowId > 1) {
      const newId = rowId - 1;
      setRowId(newId);

      const copyEntered = [...enteredData];
      copyEntered.pop();
      setEnteredData(copyEntered);

      setTotalSum(
        copyEntered.reduce((prev, current) => {
          return prev + current.sum;
        }, 0)
      );
    }
  };

  // HANDLE CHANGE IN INPUTS
  const handleChange = (id, e, selectValue) => {
    let copy = [...enteredData];
    copy.map((el) => {
      if (el.id == id) {
        selectValue
          ? (el[e.name] = selectValue.value)
          : (el[e.target.name] = e.target.value);

        el.sum = el?.nightPrice * el?.nights * el?.roomQty;
      }
    });
    setEnteredData(copy);
    setTotalSum(
      copy.reduce((prev, current) => {
        return prev + current.sum;
      }, 0)
    );
  };

  const reset = () => {
    setEnteredData([
      {
        id: 1,
        title: "",
        roomType: "",
        roomQty: "",
        nights: "",
        nightPrice: "",
        sum: 0,
      },
    ]);

    setTotalSum(0);
  };

  return (
    <div className="hotels">
      <div className="hotels-header">
        <h2>Hotels</h2>
        <div className="add-delete-btns">
          {rowId == 1 && (
            <button className="btn reset" onClick={() => reset()}>
              Reset
            </button>
          )}
          <button className="btn delete" onClick={() => deleteRow()}>
            Delete
          </button>
          <button className="btn add" onClick={() => addRow()}>
            Add
          </button>
        </div>
      </div>

      <div className="hotels-body">
        <table>
          <thead>
            <tr>
              {Table_data.hotels.headings.map((heading) => {
                return <th key={heading}>{heading}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {[...enteredData].map((row) => {
              return (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>
                    <input
                      placeholder="Enter hotel..."
                      defaultValue={enteredData.title}
                      value={row.title}
                      type="text"
                      name="title"
                      onChange={(e) => handleChange(row.id, e)}
                    />
                  </td>

                  <td>
                    <Select
                      name="roomType"
                      value={
                        row.roomType
                          ? { value: row.roomType, label: row.roomType }
                          : ""
                      }
                      onChange={(value, event) =>
                        handleChange(row.id, event, value)
                      }
                      classNamePrefix="room-type-select"
                      options={[
                        { value: "single", label: "Single" },
                        { value: "twin", label: "Twin" },
                      ]}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Enter quantity of rooms..."
                      value={row.roomQty}
                      type="number"
                      min={0}
                      name="roomQty"
                      onChange={(e) => handleChange(row.id, e)}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Enter total nights..."
                      value={row.nights}
                      type="number"
                      min={0}
                      name="nights"
                      onChange={(e) => handleChange(row.id, e)}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Enter price per night..."
                      value={row.nightPrice}
                      type="number"
                      min={0}
                      name="nightPrice"
                      onChange={(e) => handleChange(row.id, e)}
                    />
                  </td>
                  <td>{row.sum} AZN</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <h3 className="total-sum">{totalSum} AZN</h3>
    </div>
  );
};

export default Hotels;

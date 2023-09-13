import React, { useState, useEffect, useContext } from "react";

import { Table_data } from "./Tables_data";
import { AppContext } from "../../../pages/tours_lists/Tours_list";

const Additional = () => {
  const [rowId, setRowId] = useState(1);
  const [enteredData, setEnteredData] = useState([
    {
      id: 1,
      service: "",
      price: "",
      sum: 0,
    },
  ]);

  const { setTotals, setSaveTour, editingTour, editMode } =
    useContext(AppContext);

  const [totalSum, setTotalSum] = useState(
    editMode
      ? editingTour.calculation.additional.reduce((prev, current) => {
          return prev + current.sum;
        }, 0)
      : 0
  );

  useEffect(() => {
    if (editMode) {
      setEnteredData(editingTour.calculation.additional);

      let copy = [...editingTour.calculation.additional];

      setRowId(copy.length);
    }
  }, []);

  useEffect(() => {
    setTotals((prev) => ({ ...prev, additional: totalSum }));
  }, [totalSum]);

  useEffect(() => {
    setSaveTour((prev) => ({
      ...prev,
      calculation: { ...prev.calculation, additional: enteredData },
    }));
  }, [enteredData]);
  // ADD A NEW ROW
  const addRow = () => {
    const newId = rowId + 1;
    setRowId(newId);

    const copyEntered = [...enteredData];
    const newRow = {
      id: newId,
      service: "",
      price: "",
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
  const handleChange = (id, e) => {
    let copy = [...enteredData];
    copy.map((el) => {
      if (el.id == id) {
        el[e.target.name] = e.target.value;

        el.sum = Number(el.price);
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
        service: "",
        price: "",
        sum: 0,
      },
    ]);

    setTotalSum(0);
  };

  return (
    <div className="additional">
      <div className="additional-header">
        <h2>Additional</h2>
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

      <div className="additional-body">
        <table>
          <thead>
            <tr>
              {Table_data.additional.headings.map((heading) => {
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
                      placeholder="Enter service name..."
                      value={row.service}
                      type="text"
                      name="service"
                      onChange={(e) => handleChange(row.id, e)}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Enter number..."
                      value={row.price}
                      type="number"
                      min={0}
                      name="price"
                      onChange={(e) => handleChange(row.id, e)}
                    />
                  </td>
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

export default Additional;

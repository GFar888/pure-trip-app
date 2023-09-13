import React, { useState, useEffect, useContext } from "react";

import { Table_data } from "./Tables_data";
import { AppContext } from "../../../pages/tours_lists/Tours_list";

const Meal = () => {
  const [rowId, setRowId] = useState(1);
  const [enteredData, setEnteredData] = useState([
    {
      id: 1,
      menuPrice: "",
      guestNum: "",
      quantity: "",
      sum: 0,
    },
  ]);

  const { setTotals, setSaveTour, editingTour, editMode } =
    useContext(AppContext);
  const [totalSum, setTotalSum] = useState(
    editMode
      ? editingTour.calculation.meal.reduce((prev, current) => {
          return prev + current.sum;
        }, 0)
      : 0
  );

  useEffect(() => {
    if (editMode) {
      setEnteredData(editingTour.calculation.meal);

      let copy = [...editingTour.calculation.meal];

      setRowId(copy.length);
    }
  }, []);

  useEffect(() => {
    setTotals((prev) => ({ ...prev, meal: totalSum }));
  }, [totalSum]);

  useEffect(() => {
    setSaveTour((prev) => ({
      ...prev,
      calculation: { ...prev.calculation, meal: enteredData },
    }));
  }, [enteredData]);

  // ADD A NEW ROW
  const addRow = () => {
    const newId = rowId + 1;
    setRowId(newId);

    const copyEntered = [...enteredData];
    const newRow = {
      id: newId,
      menuPrice: "",
      guestNum: "",
      quantity: "",
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

        el.sum = el.menuPrice * el.guestNum * el.quantity;
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
        menuPrice: "",
        guestNum: "",
        quantity: "",
        sum: 0,
      },
    ]);

    setTotalSum(0);
  };

  return (
    <div className="meal">
      <div className="meal-header">
        <h2>Meal</h2>
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

      <div className="meal-body">
        <table>
          <thead>
            <tr>
              {Table_data.meal.headings.map((heading) => {
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
                      placeholder="Enter menu price..."
                      value={row.menuPrice}
                      type="number"
                      min={0}
                      name="menuPrice"
                      onChange={(e) => handleChange(row.id, e)}
                    />
                  </td>

                  <td>
                    <input
                      placeholder="Enter guest number..."
                      value={row.guestNum}
                      type="number"
                      min={0}
                      name="guestNum"
                      onChange={(e) => handleChange(row.id, e)}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Enter meal quantity..."
                      value={row.quantity}
                      type="number"
                      min={0}
                      name="quantity"
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

export default Meal;

import React, { useState, useEffect, useContext } from "react";

import { Table_data } from "./Tables_data";

import { AppContext } from "../../../pages/tours_lists/Tours_list";

const Guide = () => {
  const [rowId, setRowId] = useState(1);
  const [enteredData, setEnteredData] = useState([
    {
      id: 1,
      halfDay: "",
      wholeDay: "",
      meal: "",
      stay: "",
      sum: 0,
    },
  ]);

  const { setTotals, setSaveTour, editingTour, editMode, defaultData } =
    useContext(AppContext);

  const [totalSum, setTotalSum] = useState(
    editMode
      ? editingTour.calculation.guide.reduce((prev, current) => {
          return prev + current.sum;
        }, 0)
      : 0
  );

  useEffect(() => {
    if (editMode) {
      setEnteredData(editingTour.calculation.guide);

      let copy = [...editingTour.calculation.guide];

      setRowId(copy.length);
    }
  }, []);

  useEffect(() => {
    setTotals((prev) => ({ ...prev, guide: totalSum }));
  }, [totalSum]);

  useEffect(() => {
    setSaveTour((prev) => ({
      ...prev,
      calculation: { ...prev.calculation, guide: enteredData },
    }));
  }, [enteredData]);

  // ADD A NEW ROW
  const addRow = () => {
    const newId = rowId + 1;
    setRowId(newId);

    const copyEntered = [...enteredData];
    const newRow = {
      id: newId,
      halfDay: "",
      wholeDay: "",
      meal: "",
      stay: "",
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

        el.sum =
          Number(el.halfDay * defaultData.guide["Half Day"]) +
          Number(el.wholeDay * defaultData.guide["Whole Day"]) +
          Number(el.meal * defaultData.guide["Meal"]) +
          Number(el.stay) * defaultData.guide["Stay"];
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
        halfDay: "",
        wholeDay: "",
        meal: "",
        stay: "",
        sum: 0,
      },
    ]);

    setTotalSum(0);
  };

  return (
    <div className="guide">
      <div className="guide-header">
        <h2>Guide</h2>
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

      <div className="guide-body">
        <table>
          <thead>
            <tr>
              {Table_data.guide.headings.map((heading) => {
                return (
                  <th key={heading}>
                    {heading + " "}
                    {Object.keys(defaultData ? defaultData.guide : "").includes(
                      heading
                    ) ? (
                      <span className="red">
                        ({defaultData.guide[heading]} AZN)
                      </span>
                    ) : (
                      ""
                    )}
                  </th>
                );
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
                      value={row.halfDay}
                      placeholder="Enter the quantity..."
                      type="number"
                      min={0}
                      name="halfDay"
                      onChange={(e) => handleChange(row.id, e)}
                    />
                  </td>

                  <td>
                    <input
                      value={row.wholeDay}
                      placeholder="Enter the quantity..."
                      type="number"
                      min={0}
                      name="wholeDay"
                      onChange={(e) => handleChange(row.id, e)}
                    />
                  </td>
                  <td>
                    <input
                      value={row.meal}
                      placeholder="Enter the quantity..."
                      type="number"
                      min={0}
                      name="meal"
                      onChange={(e) => handleChange(row.id, e)}
                    />
                  </td>
                  <td>
                    <input
                      value={row.stay}
                      placeholder="Enter the quantity..."
                      type="number"
                      min={0}
                      name="stay"
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

export default Guide;

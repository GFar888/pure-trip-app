import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import { Table_data } from "./Tables_data";

import { AppContext } from "../../../pages/tours_lists/Tours_list";

const Tickets = () => {
  const [rowId, setRowId] = useState(1);
  const [enteredData, setEnteredData] = useState([
    {
      id: 1,
      title: "",
      price: 0,
      guestNum: "",
      sum: 0,
    },
  ]);

  const { setTotals, setSaveTour, editingTour, editMode, defaultData } =
    useContext(AppContext);
  const [totalSum, setTotalSum] = useState(
    editMode
      ? editingTour.calculation.tickets.reduce((prev, current) => {
          return prev + current.sum;
        }, 0)
      : 0
  );

  useEffect(() => {
    setTotals((prev) => ({ ...prev, tickets: totalSum }));
  }, [totalSum]);

  useEffect(() => {
    if (editMode) {
      setEnteredData(editingTour.calculation.tickets);

      let copy = [...editingTour.calculation.tickets];

      setRowId(copy.length);
    }
  }, []);

  // ADD A NEW ROW
  const addRow = () => {
    const newId = rowId + 1;
    setRowId(newId);

    const copyEntered = [...enteredData];
    const newRow = {
      id: newId,
      title: "",
      price: 0,
      guestNum: "",
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

  useEffect(() => {
    setSaveTour((prev) => ({
      ...prev,
      calculation: { ...prev.calculation, tickets: enteredData },
    }));
  }, [enteredData]);

  // HANDLE CHANGE IN INPUTS
  const handleChange = (id, e, selectValue, defaultPrice) => {
    let copy = [...enteredData];
    copy.map((el) => {
      if (el.id == id) {
        selectValue
          ? (el[e.name] = selectValue.label) &&
            (el["price"] = selectValue.value)
          : (el[e.target.name] = e.target.value);

        el.sum = el.price * el.guestNum;
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
        price: 0,
        guestNum: "",
        sum: 0,
      },
    ]);

    setTotalSum(0);
  };

  return (
    <div className="tickets">
      <div className="tickets-header">
        <h2>Tickets</h2>
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

      <div className="tickets-body">
        <table>
          <thead>
            <tr>
              {Table_data.tickets.headings.map((heading) => {
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
                    <Select
                      value={
                        row.title ? { value: row.title, label: row.title } : ""
                      }
                      menuPlacement="top"
                      name="title"
                      defaultValue={{ value: row.title, label: row.title }}
                      onChange={(value, event) =>
                        handleChange(row.id, event, value)
                      }
                      classNamePrefix="spot-select"
                      options={Object.keys(
                        defaultData ? defaultData.tickets : ""
                      ).map((el) => {
                        return { value: defaultData.tickets[el], label: el };
                      })}
                    />
                  </td>
                  <td>
                    <input
                      value={enteredData[row.id - 1].price}
                      type="number"
                      min={0}
                      name="price"
                      onChange={(e) => handleChange(row.id, e)}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Enter guest number..."
                      type="number"
                      min={0}
                      value={row.guestNum}
                      name="guestNum"
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

export default Tickets;

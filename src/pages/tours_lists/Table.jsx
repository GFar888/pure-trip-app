import React, { useContext, useState, useEffect } from "react";
import { TiArrowUnsorted } from "react-icons/ti";
import { TbTrash, TbDownload, TbPencil } from "react-icons/tb";
import { useForm } from "react-hook-form";
import timestampToDate from "../../utils/timestampToDate";
import { status } from "../../components/AddTour/status_data";
import { columns } from "./data";

import Swal from "sweetalert2";

import TableSkeleton, { Checkbox } from "./TableSkeleton";

import {
  collection,
 
  doc,
  deleteDoc,
 
} from "firebase/firestore";
import { db } from "../../config/firebase";

const Table = ({
  searchValue,
  isLoading,
  table_data,
  selectRowNumber,
  
  setEditTourId,
  setEditMode,
}) => {
  const [tableData, setTableData] = useState([]);
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    selectRowNumber(selectedRows);
  }, [selectedRows]);

  useEffect(() => {
    if (searchValue) {
      let searched = table_data.filter((el) =>
        el.customerInfo.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setTableData(searched);
    } else {
      setTableData(table_data);
    }
  }, [table_data, searchValue]);

  const sort = (header) => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));

    switch (header.target.parentElement.id) {
      case "created":
        if (sortDirection == "asc") {
          let sortedID = [...tableData].sort((a, b) =>
            a.createDate < b.createDate
              ? 1
              : a.createDate > b.createDate
              ? -1
              : 0
          );
          setTableData(sortedID);
        } else if (sortDirection == "desc") {
          let sortedID = [...tableData].sort((a, b) =>
            a.createDate > b.createDate
              ? 1
              : a.createDate < b.createDate
              ? -1
              : 0
          );
          setTableData(sortedID);
        }
        break;
      case "totalPrice":
        if (sortDirection == "asc") {
          let sortedID = [...tableData].sort((a, b) =>
            a.totalPrice.cny < b.totalPrice.cny
              ? 1
              : a.totalPrice.cny > b.totalPrice.cny
              ? -1
              : 0
          );
          setTableData(sortedID);
        } else if (sortDirection == "desc") {
          let sortedID = [...tableData].sort((a, b) =>
            a.totalPrice.cny > b.totalPrice.cny
              ? 1
              : a.totalPrice.cny < b.totalPrice.cny
              ? -1
              : 0
          );
          setTableData(sortedID);
        }
        break;
      case "customer":
        if (sortDirection == "asc") {
          let sortedID = [...tableData].sort((a, b) =>
            b.customerInfo.name.localeCompare(a.customerInfo.name)
          );
          setTableData(sortedID);
        } else if (sortDirection == "desc") {
          let sortedID = [...tableData].sort((a, b) =>
            a.customerInfo.name.localeCompare(b.customerInfo.name)
          );
          setTableData(sortedID);
        }
        break;
      default:
        break;
    }
  };

  const handleSelection = (e) => {
    let isSelected = e.target.checked;
    let value = parseInt(e.target.value);

    if (isSelected) {
      setSelectedRows([...selectedRows, value]);
    } else {
      setSelectedRows((prev) => {
        return prev.filter((id) => id !== value);
      });
    }
  };

  const deleteRow = async (tourId) => {
    Swal.fire({
      title: "Are you sure?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#7364ff",
      cancelButtonColor: "#f43f5e",
    }).then((result) => {
      if (result.isConfirmed) {
        const docRef = doc(collection(db, "allTours"), tourId);
        deleteDoc(docRef);

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
          title: "Deleted",
        });
      } else {
        return;
      }
    });
  };

  const editTour = (tourId) => {
    setEditTourId((prev) => ({ ...prev, id: tourId }));
    setEditMode(true);

    // openAddTour(true);
  };

  const handleCheckAll = (e) => {
    if (tableData.length === selectedRows.length) {
      setSelectedRows([]);
    } else {
      const allCheckboxes = tableData.map((el) => parseInt(el.tourId));
      !e.target.checked ? setSelectedRows([]) : setSelectedRows(allCheckboxes);
    }
  };

  return (
    <>
      <table className="main-table">
        <thead>
          <tr>
            <th>
              <input
                id="select-all"
                type="checkbox"
                onChange={handleCheckAll}
              />
            </th>
            {columns.map((header) => {
              return (
                <th key={header.name} id={header.accessorKey}>
                  <h5 onClick={(header) => sort(header)}>{header.name}</h5>
                  {["customer", "created", "totalPrice"].includes(
                    header.accessorKey
                  ) ? (
                    <TiArrowUnsorted className="icon" />
                  ) : (
                    ""
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {isLoading &&
            new Array(10).fill().map((_, i) => (
              <tr key={i}>
                {
                  <td>
                    <Checkbox />
                  </td>
                }
                {new Array(7).fill().map((_, i) => (
                  <td key={i}>
                    <TableSkeleton />
                  </td>
                ))}
              </tr>
            ))}

          {tableData.map((el) => {
            return (
              <tr
                key={el.tourId}
                className={
                  selectedRows.includes(parseInt(el.tourId)) ? "highlight" : ""
                }
              >
                <td>
                  <input
                    id="select-row"
                    type="checkbox"
                    value={el.tourId}
                    onChange={handleSelection}
                    checked={selectedRows.includes(parseInt(el.tourId))}
                  />
                </td>
                <td>{el.tourId}</td>
                <td>{!el.customerInfo.name ? "N/A" : el.customerInfo.name}</td>

                <td>
                  {status.map((elm) => {
                    return elm.value == el.status ? (
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
                </td>

                <td>{timestampToDate(el.createDate)}</td>
                <td>{timestampToDate(el.updateDate)}</td>

                <td>{el.totalPrice.azn}</td>
                <td>
                  <TbPencil
                    className="edit-icon action"
                    onClick={() => editTour(el.tourId)}
                  />
                  <TbDownload className="download-icon action" />
                  <TbTrash
                    className="delete-icon action"
                    onClick={() => deleteRow(el.tourId)}
                  />
                </td>
              </tr>
            );
          })}
          {!tableData.length && !isLoading && (
            <tr>
              <td colSpan={8}>No Records Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default Table;

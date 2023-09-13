import React, { useEffect, useState, createContext } from "react";
import { AiOutlineSearch } from "react-icons/ai";

import Table from "./Table";
import AddTour from "../../components/AddTour/AddTour";
import Swal from "sweetalert2";
import { customAlphabet } from "nanoid";
import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../config/firebase";

export const AppContext = createContext();

const Tours_list = () => {
  const nanoid = customAlphabet("1234567890", 10);
  const [selectedRange, setSelectedRange] = useState();
  const [openAddTour, setOpenAddTour] = useState(false);
  const [allToursData, setAllToursData] = useState([]);
  const [defaultData, setDefaultData] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [idAndTime, setIdAndTime] = useState({
    tourId: "",
    createDate: "",
    updateDate: "",
  });
  const [editTourId, setEditTourId] = useState({});
  const [editingTour, setEditingTour] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  const [totals, setTotals] = useState({
    hotels: 0,
    tickets: 0,
    meal: 0,
    guide: 0,
    additional: 0,
  });

  useEffect(() => {
    if (editMode) {
      const editRef = allToursData.find((tour) => tour.tourId == editTourId.id);
      setEditingTour(editRef);
      setIdAndTime((prev) => ({
        ...prev,
        tourId: editRef.tourId,
        createDate: editRef.createDate,
        updateDate: new Date().getTime(),
      }));

      setOpenAddTour(true);
    }
  }, [editMode]);

  const [saveTour, setSaveTour] = useState({
    tourId: "",
    createDate: "",
    updateDate: "",
    status: "",
    customerInfo: "",
    tourInfo: "",
    calculation: {
      hotels: "",
      tickets: "",
      meal: "",
      guide: "",
      additional: "",
    },
    totalPrice: {
      azn: "",
      cny: "",
      usd: "",
    },
    currency: {
      azn: "",
      cny: "",
      usd: "",
    },
    defaultPrices: "",
  });

  useEffect(() => {
    setSaveTour((prev) => ({
      ...prev,
      tourId: idAndTime.tourId,
      createDate: idAndTime.createDate,
      updateDate: idAndTime.updateDate,
    }));
  }, [idAndTime]);

  const onInputChange = (event) => {
    setSelectedRange(event.value);
  };

  const getTours = () => {
    const unsubscribe = onSnapshot(collection(db, "allTours"), (snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      setAllToursData(newData);
      setIsLoading(false);
    });

    return unsubscribe;
  };

  useEffect(() => {
    getTours();
    // const defaultDataLocal = JSON.parse(localStorage.getItem("defaultPrices"));

    // setDefaultData(defaultDataLocal);
  }, []);

  const deleteSelected = async () => {
    if (selectedRows.length === 0) {
      return;
    }

    try {
      Swal.fire({
        title: "Are you sure?",
        showCancelButton: true,
        confirmButtonText: "Yes",
        confirmButtonColor: "#7364ff",
        cancelButtonColor: "#f43f5e",
      }).then((result) => {
        if (result.isConfirmed) {
          const batch = writeBatch(db);
          selectedRows.forEach((ref) => {
            const docRef = doc(collection(db, "allTours"), String(ref));
            batch.delete(docRef);
          });
          setSelectedRows([]);

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

          return batch.commit();
        } else {
          return;
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const addNewTour = () => {
    setEditTourId("");
    setTotals({
      hotels: 0,
      tickets: 0,
      meal: 0,
      guide: 0,
      additional: 0,
    });
    const createDate = new Date().getTime();

    const tourId = nanoid(6);

    setIdAndTime((prev) => ({
      ...prev,
      tourId: tourId,
      createDate: createDate,
      updateDate: createDate,
    }));

    setOpenAddTour(true);
  };

  const getDefaultData = async () => {
    const docRef = doc(db, "defaultPrices", "Guide_Tickets");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setDefaultData(docSnap.data());
      setSaveTour((prev) => ({
        ...prev,
        defaultPrices: docSnap.data(),
      }));
    } else {
      console.log("No such document!");
    }
  };

  useEffect(() => {
    getDefaultData();
  }, []);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <>
      <AppContext.Provider
        value={{
          totals,
          setTotals,
          saveTour,
          setSaveTour,
          allToursData,
          editTourId,
          editingTour,
          editMode,
          setEditMode,
          defaultData,
        }}
      >
        {openAddTour ? (
          <AddTour
            idAndTime={idAndTime}
            allToursData={allToursData}
            openAddTour={setOpenAddTour}
          />
        ) : (
          <div className="tours_list_container">
            <div className="tours_header">
              <h1>Tours List</h1>
              <div className="days_add_tour">
                <button className="addTour_btn" onClick={addNewTour}>
                  + Add tour
                </button>
              </div>
            </div>
            <div className="tours">
              <div className="top-block">
                <div className="left_group">
                  <h2>All Tours {allToursData.length}</h2>
                  <div className="search-wrapper">
                    <AiOutlineSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search..."
                      onChange={handleSearch}
                    />
                  </div>
                </div>

                <div className="right_group">
                  <h3>
                    {selectedRows.length} item
                    {selectedRows.length > 1 ? "s" : ""} selected
                  </h3>
                  <button className="delete_btn" onClick={deleteSelected}>
                    Delete
                  </button>
                </div>
              </div>
              <div className="table" id="example-table">
                <Table
                  searchValue={searchValue}
                  isLoading={isLoading}
                  setEditMode={setEditMode}
                  setEditTourId={setEditTourId}
                  table_data={allToursData}
                  selectRowNumber={setSelectedRows}
                  openAddTour={setOpenAddTour}
                />
              </div>
            </div>
          </div>
        )}
      </AppContext.Provider>
    </>
  );
};

export default Tours_list;

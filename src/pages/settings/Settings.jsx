import React, { useState, useEffect } from "react";

import { LiaSave, LiaEdit, LiaPlusSquare } from "react-icons/lia";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import Swal from "sweetalert2";
import SettingSkeleton from "./SettingSkeleton";

function Settings() {
  const [defaultData, setDefaultData] = useState();
  const [isDisabledTickets, setIsDisabledTickets] = useState(true);
  const [isDisabledGuide, setIsDisabledGuide] = useState(true);
  const [saveTickets, setSaveTickets] = useState(false);
  const [saveGuide, setSaveGuide] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newSpot, setNewSpot] = useState({ newTitle: "", newPrice: "" });

  //GET TICKETS AND GUIDE DEFAULT PRICES
  const getDefaultData = async () => {
    const docRef = doc(db, "defaultPrices", "Guide_Tickets");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setDefaultData(docSnap.data());
      setIsLoading(false);
    } else {
      console.log("No such document!");
    }
  };

  useEffect(() => {
    getDefaultData();
  }, []);

  //SAVE EDITED PRICES
  const saveNewPrice = async () => {
    Swal.showLoading();

    await setDoc(doc(db, "defaultPrices", "Guide_Tickets"), defaultData);
    Swal.close();
    // Swal.hideLoading();
    setIsDisabledTickets(true);
    setIsDisabledGuide(true);

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
      title: "Saved!",
    });
  };

  //HANDLE CHANGES IN INPUTS
  const handleChange = (e, title) => {
    if (title === "guide") {
      setSaveGuide(true);
      setDefaultData((prev) => ({
        ...prev,
        guide: { ...prev.guide, [e.target.name]: Number(e.target.value) },
      }));
    } else if (title === "tickets") {
      setSaveTickets(true);
      setDefaultData((prev) => ({
        ...prev,
        tickets: { ...prev.tickets, [e.target.name]: Number(e.target.value) },
      }));
    }
  };

  //ADD NEW SPOT WITH PRICE
  const addNewSpot = async () => {
    if (!newSpot.newTitle) {
      return;
    }
    setDefaultData((prev) => ({
      ...prev,
      tickets: {
        ...prev.tickets,
        [newSpot.newTitle]: Number(newSpot.newPrice),
      },
    }));
    setNewSpot({ newTitle: "", newPrice: "" });
    setSaveTickets(true);
  };

  return (
    <div className="settings-container">
      <div className="settings">
        <div className="ticket-prices">
          <div className="title-icons">
            <h2>Ticket prices</h2>
            <div className={saveTickets ? "icons save" : "icons"}>
              <LiaEdit
                className="icon-edit-price"
                onClick={() => setIsDisabledTickets((prev) => !prev)}
              />
              <LiaSave
                className="icon-save-price"
                onClick={() => (saveNewPrice(), setSaveTickets(false))}
              />
            </div>
          </div>
          <div className="new-spot">
            <input
              type="text"
              name="spotTitle"
              placeholder="Enter spot name..."
              value={newSpot.newTitle}
              onChange={(e) =>
                setNewSpot((prev) => ({ ...prev, newTitle: e.target.value }))
              }
            />
            <input
              type="number"
              value={newSpot.newPrice}
              min={0}
              name="spotPrice"
              placeholder="Enter spot price..."
              onChange={(e) =>
                setNewSpot((prev) => ({ ...prev, newPrice: e.target.value }))
              }
            />
            <LiaPlusSquare className="plus-icon" onClick={addNewSpot} />
          </div>

          <div className="all-tickets">
            {isLoading &&
              new Array(8)
                .fill()
                .map((_, i) => (
                  <SettingSkeleton
                    key={i}
                    style={{ display: "block", marginBottom: "1rem" }}
                  />
                ))}

            {defaultData &&
              Object.keys(defaultData.tickets)
                .sort((a, b) => a.localeCompare(b))
                .map((el) => {
                  return (
                    <React.Fragment key={el}>
                      <p>{el}</p>
                      <div className="label-input-wrapper">
                        <input
                          disabled={isDisabledTickets}
                          type="number"
                          min={0}
                          name={el}
                          defaultValue={defaultData.tickets[el]}
                          onChange={(e) => handleChange(e, "tickets")}
                        />
                      </div>
                    </React.Fragment>
                  );
                })}
          </div>
        </div>

        <div className="guide-prices">
          <div className="title-icons">
            <h2>Guide prices</h2>
            <div className={saveGuide ? "icons save" : "icons"}>
              <LiaEdit
                className="icon-edit-price"
                onClick={() => setIsDisabledGuide((prev) => !prev)}
              />
              <LiaSave
                className="icon-save-price"
                onClick={() => (saveNewPrice(), setSaveGuide(false))}
              />
            </div>
          </div>

          <div className="all-guides">
            {isLoading &&
              new Array(4)
                .fill()
                .map((_, i) => (
                  <SettingSkeleton
                    key={i}
                    style={{ display: "block", marginBottom: "1rem" }}
                  />
                ))}
            {defaultData &&
              Object.keys(defaultData.guide).map((el) => {
                return (
                  <React.Fragment key={el}>
                    <p>{el}</p>
                    <div className="label-input-wrapper">
                      <input
                        disabled={isDisabledGuide}
                        type="number"
                        min={0}
                        name={el}
                        defaultValue={defaultData.guide[el]}
                        onChange={(e) => handleChange(e, "guide")}
                      />
                    </div>
                  </React.Fragment>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;

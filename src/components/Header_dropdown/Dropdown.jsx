import React, { useRef, useEffect, useState } from "react";
import styles from "./dropdown.module.scss";
import { FaRegUser } from "react-icons/fa6";

import { MdLogout } from "react-icons/md";
import { auth } from "../../config/firebase.js";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Dropdown = ({ setShowDropdown, setShowProfile }) => {
  const navigate = useNavigate();
  const handleLogOut = () => {
    signOut(auth);
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleProfile = async (e) => {
    e.stopPropagation();
    setShowDropdown(false);
    setShowProfile(true);
  };

  return (
    <div className={styles.dropdown}>
      <ul>
        <li onClick={handleProfile}>
          <FaRegUser className={styles.icon} />
          View Profile
        </li>

        <li onClick={handleLogOut}>
          <MdLogout className={styles.icon} />
          Log Out
        </li>
      </ul>
    </div>
  );
};

export default Dropdown;

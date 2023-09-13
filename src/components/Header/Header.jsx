import React, { useState, useEffect, useRef } from "react";
import logo from "../../assets/images/logo.svg";

import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import Dropdown from "../Header_dropdown/Dropdown";

import Profile from "../Profile/Profile";
import Avatar_Skeleton from "./Avatar_skeleton";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../config/firebase";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [currentUser, setCurrenUser] = useState();
  const [avatar, setAvatar] = useState();
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrenUser(user);
        setAvatar(user.photoURL);
      }
    });
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      const path = e.composedPath().includes(dropdownRef.current);
      if (!path) {
        setShowDropdown(false);
      }
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <div className="header">
      {showProfile && (
        <Profile
          avatar={avatar}
          setAvatar={setAvatar}
          currentUser={currentUser}
          setShowProfile={setShowProfile}
        />
      )}
      <div className="header_logo">
        <img src={logo} />
        <h2>PureTrip</h2>
      </div>

      <div ref={dropdownRef} className="user_section">
        <div id="verticle-line"></div>

        <Avatar_Skeleton
          style={{ display: !avatarLoaded ? "block" : "none" }}
        />

        <img
          style={{ display: avatarLoaded ? "block" : "none" }}
          className="avatar"
          src={avatar}
          onLoad={() => setAvatarLoaded(true)}
        />
        <h3 style={{ display: avatarLoaded ? "block" : "none" }}>
          {currentUser?.displayName}
        </h3>

        {showDropdown ? (
          <FaAngleUp
            className="drop-icon"
            onClick={() => setShowDropdown((prev) => !prev)}
          />
        ) : (
          <FaAngleDown
            className="drop-icon"
            onClick={() => setShowDropdown((prev) => !prev)}
          />
        )}
        {showDropdown && (
          <Dropdown
            setShowProfile={setShowProfile}
            setShowDropdown={setShowDropdown}
          />
        )}
      </div>
    </div>
  );
};

export default Header;

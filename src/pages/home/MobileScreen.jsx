import React from "react";
import logo from "../../assets/images/logo.svg";

const MobileScreen = () => {
  return (
    <>
      <div className="mobile-background"></div>
      <div className="mobile-container">
        <img src={logo} />
        <h1>This content is only available for desktop.</h1>
      </div>
    </>
  );
};

export default MobileScreen;

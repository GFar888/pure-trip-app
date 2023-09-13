import React, { useState } from "react";
import { SidebarData } from "./Sidebar_data";
import { Link, Outlet, useLocation } from "react-router-dom";

const Sidebar = () => {
  const usePathname = () => {
    const pathname = useLocation().pathname;
    return pathname == "/home" ? 0 : 1;
  };
  const [selectedId, setSelectedId] = useState(usePathname());

  return (
    <>
      <div className="sidebar">
        <div className="list_wrapper">
          <h3>TOURS+</h3>
          <ul className="list">
            {SidebarData.map((item) => {
              return (
                <Link to={item.path} key={item.id}>
                  <li
                    className={
                      selectedId === item.id ? "list_item active" : "list_item"
                    }
                    onClick={() => setSelectedId(item.id)}
                  >
                    {item.icon}

                    <h4>{item.title}</h4>
                  </li>
                </Link>
              );
            })}
          </ul>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Sidebar;

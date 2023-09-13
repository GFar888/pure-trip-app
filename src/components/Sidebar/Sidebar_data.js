import React from "react";
import { FaListUl } from "react-icons/fa6";
import { SlSettings } from "react-icons/sl";

export const SidebarData = [
  {
    id: 0,
    title: "Tours list",
    path: "/home",
    icon: <FaListUl className="list_icon" />,
  },
  {
    id: 1,
    title: "Settings",
    path: "/settings",
    icon: <SlSettings className="list_icon" />,
  },
];

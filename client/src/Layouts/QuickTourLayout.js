import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import QuickTour from "../components/QuickTour/QuickTour";
import Aside from "../modules/SideNav/Aside";


function QuickTourLayout() {

  const rtl = false;

  const [toggled, setToggled] = useState(false);

  const handleToggleSidebar = (value) => {
    setToggled(value);
  };

  return (
    <div className={`app ${rtl ? "rtl" : ""} ${toggled ? "toggled" : ""}`}>
      <Aside
        rtl={rtl}
        toggled={toggled}
        handleToggleSidebar={handleToggleSidebar}
      />
      <QuickTour handleToggleSidebar={handleToggleSidebar} />
    </div>
  );
}

export default QuickTourLayout;
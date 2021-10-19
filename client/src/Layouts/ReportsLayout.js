import React, { useState } from "react";

import Aside from "../modules/SideNav/Aside";
import Reports from "../components/Reports&Analytics/Reports";

function ReportsLayout() {
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
      <Reports handleToggleSidebar={handleToggleSidebar} />
    </div>
  );
}

export default ReportsLayout;

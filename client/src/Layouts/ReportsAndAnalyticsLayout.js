import React, { useState } from "react";

import Aside from "../modules/SideNav/Aside";
import ReportsAndAnalytics from "../components/Reports&Analytics/ReportsAndAnalytics";

function ReportsAndAnalyticsLayout() {
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
      <ReportsAndAnalytics handleToggleSidebar={handleToggleSidebar} />
    </div>
  );
}

export default ReportsAndAnalyticsLayout;

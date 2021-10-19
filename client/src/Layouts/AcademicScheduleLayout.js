import React, { useState } from "react";

import Aside from "../modules/SideNav/Aside";
import AcademicSchedule from "../components/MyPrograms/AcademicSchedule/AcademicSchedule";

function AcademicScheduleLayout() {
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
      <AcademicSchedule handleToggleSidebar={handleToggleSidebar} />
    </div>
  );
}

export default AcademicScheduleLayout;

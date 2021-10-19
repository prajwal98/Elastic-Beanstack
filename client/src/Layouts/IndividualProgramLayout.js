import React, { useState } from "react";
import IndividualProgram from "../components/MyPrograms/IndividualProgram";

import Aside from "../modules/SideNav/Aside";

function IndividualProgramLayout() {
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
      <IndividualProgram handleToggleSidebar={handleToggleSidebar} />
    </div>
  );
}

export default IndividualProgramLayout;

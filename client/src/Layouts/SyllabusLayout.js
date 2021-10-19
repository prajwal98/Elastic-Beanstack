import React, { useState } from "react";

import Aside from "../modules/SideNav/Aside";
import Syllabus from "../components/MyPrograms/Syllabus/Syllabus";

function SyllabusLayout() {
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
      <Syllabus handleToggleSidebar={handleToggleSidebar} />
    </div>
  );
}

export default SyllabusLayout;

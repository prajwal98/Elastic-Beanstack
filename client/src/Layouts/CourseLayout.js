import React, { useState } from "react";
import Course from "../components/CourseStructure/Course";
import Aside from "../modules/SideNav/Aside";

export default function CourseLayout() {
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
      <Course handleToggleSidebar={handleToggleSidebar} />
    </div>
  );
}

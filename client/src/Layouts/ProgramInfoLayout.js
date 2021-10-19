import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Aside from "../modules/SideNav/Aside";
import ProgramInfo from "../components/MyPrograms/ProgramInfo/ProgramInfo";

function ProgramInfoLayout() {
  const { pid } = useParams();
  const location = useLocation();
  console.log(location);
  console.log(pid);
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
      <ProgramInfo handleToggleSidebar={handleToggleSidebar} />
    </div>
  );
}

export default ProgramInfoLayout;

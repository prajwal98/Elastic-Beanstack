import React, { useState } from "react";
import Event from "../components/Events/Events";

import Aside from "../modules/SideNav/Aside";

function EventLayout() {
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
      <Event handleToggleSidebar={handleToggleSidebar} />
    </div>
  );
}

export default EventLayout;

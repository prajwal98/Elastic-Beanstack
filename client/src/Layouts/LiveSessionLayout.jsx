import React, { useState } from "react";
import LiveSession from "../components/LiveSession/LiveSession";
import Aside from "../modules/SideNav/Aside";

function LiveSessionLayout() {
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
      <LiveSession handleToggleSidebar={handleToggleSidebar} />
    </div>
  );
}

export default LiveSessionLayout;

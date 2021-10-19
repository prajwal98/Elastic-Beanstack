import React, { useState } from "react";

import Notification from "../components/Notification/Notification";
import Aside from "../modules/SideNav/Aside";

function NotificationLayout() {
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
      <Notification handleToggleSidebar={handleToggleSidebar} />
    </div>
  );
}

export default NotificationLayout;

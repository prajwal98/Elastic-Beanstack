import React, { useState } from "react";

import Aside from "../modules/SideNav/Aside";
import Announcements from "../components/MyPrograms/Announcements/Announcements";

function AnnouncementsLayout() {
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
      <Announcements handleToggleSidebar={handleToggleSidebar} />
    </div>
  );
}

export default AnnouncementsLayout;

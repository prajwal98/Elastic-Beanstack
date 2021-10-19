import React, { useState } from "react";
import MyApplication from "../components/MyApplication/MyApplication";
import Aside from "../modules/SideNav/Aside";

function MyApplicationLayout() {
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
      <MyApplication handleToggleSidebar={handleToggleSidebar} />
    </div>
  );
}

export default MyApplicationLayout;

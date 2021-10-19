import React, { useState } from 'react';
import MyPrograms from '../components/MyPrograms/MyPrograms';
import Aside from '../modules/SideNav/Aside';

function MyProgramsLayout() {
  const rtl = false;

  const [toggled, setToggled] = useState(false);

  const handleToggleSidebar = value => {
    setToggled(value);
  };

  return (
    <div className={`app ${rtl ? 'rtl' : ''} ${toggled ? 'toggled' : ''}`}>
      <Aside
        rtl={rtl}
        toggled={toggled}
        handleToggleSidebar={handleToggleSidebar}
      />
      <MyPrograms handleToggleSidebar={handleToggleSidebar} />
    </div>
  );
}

export default MyProgramsLayout;

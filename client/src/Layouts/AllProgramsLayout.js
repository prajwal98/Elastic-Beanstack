import React, { useState } from 'react';
import AllPrograms from '../components/AllPrograms/AllPrograms';

import Aside from '../modules/SideNav/Aside';

function AllProgramsLayout() {
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
      <AllPrograms handleToggleSidebar={handleToggleSidebar} />
    </div>
  );
}

export default AllProgramsLayout;

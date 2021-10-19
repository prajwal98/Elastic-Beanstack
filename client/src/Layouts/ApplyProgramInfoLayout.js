import React, { useState } from 'react';
import ApplyProgramInfo from '../components/ApplyProgram/ApplyProgramInfo'

import Aside from '../modules/SideNav/Aside';

function AllProgramsInfoLayout() {
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
      <ApplyProgramInfo handleToggleSidebar={handleToggleSidebar} />
    </div>
  );
}

export default AllProgramsInfoLayout;

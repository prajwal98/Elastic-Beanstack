import React, { useState } from 'react';
import Application from '../components/MyApplication/Application'

import Aside from '../modules/SideNav/Aside';

function ApplicationLayout() {
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
      <Application handleToggleSidebar={handleToggleSidebar} />
    </div>
  );
}

export default ApplicationLayout;

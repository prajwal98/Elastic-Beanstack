import React, { useState } from 'react';
import Aside from '../../../modules/SideNav/Aside';
import Dashboard from './Dashboard';

function Layout() {
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
      <Dashboard handleToggleSidebar={handleToggleSidebar} />
    </div>
  );
}

export default Layout;

import React from 'react';
import { FaBars } from 'react-icons/fa';
const Main = ({ handleToggleSidebar }) => {
  return (
    <main>
      <div className='btn-toggle' onClick={() => handleToggleSidebar(true)}>
        <FaBars />
      </div>
    </main>
  );
};

export default Main;

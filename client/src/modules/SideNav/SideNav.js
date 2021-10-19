import React from 'react';
import './SideNav.scss';
import DashboardIcon from '../../assets/svgjs/DashboardIcon';
import MyProgramsIcon from '../../assets/svgjs/MyProgramsIcon';
import ReportIcon from '../../assets/svgjs/ReportIcon';
import EventsIcon from '../../assets/svgjs/EventsIcon';
import MyApplicationsIcon from '../../assets/svgjs/MyApplicationsIcon';
import JssLogo from '../../assets/images/logo.jpg';

const SideNav = props => {
  console.log(props);
  return (
    <div>
      <nav className='sidebar'>
        <ul className='side-nav'>
          <li className='logo-container'>
            <a href='/'>
              <img src={JssLogo} alt='' />
            </a>
          </li>
          <li className='side-nav__item side-nav__item--active'>
            <a href='/dashboard' className='side-nav__link'>
              <DashboardIcon className='side-nav__icon' fill='yellow' />
              <span>Dashboard</span>
            </a>
          </li>
          <li className='side-nav__item'>
            <a href='/myPrograms' className='side-nav__link'>
              <MyProgramsIcon className='side-nav__icon' />
              <span>My Programs</span>
            </a>
          </li>
          <li className='side-nav__item'>
            <a href='/reports' className='side-nav__link'>
              <ReportIcon className='side-nav__icon' />
              <span>Reports & Analytics</span>
            </a>
          </li>
          <li className='side-nav__item'>
            <a href='/events' className='side-nav__link'>
              <EventsIcon className='side-nav__icon' />
              <span>Events</span>
            </a>
          </li>
          <li className='side-nav__item'>
            <a href='/myApplication' className='side-nav__link'>
              <MyApplicationsIcon className='side-nav__icon' />
              <span>My Applications</span>
            </a>
          </li>
        </ul>

        <div className='legal'>&copy; Powered by enhanzED.</div>
      </nav>
    </div>
  );
};

export default SideNav;

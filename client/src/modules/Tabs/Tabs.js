import React from 'react';
import { Tab } from 'semantic-ui-react';
import InstructorsCard from '../Cards/Instructors/InstructorsCard';
import './Tabs.scss';
const panes = [
  {
    menuItem: 'Overview',
    render: () => (
      <Tab.Pane className='overview-content'>
        <div>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nam qui
            dolorum animi odit quae impedit, ratione repellendus rem dicta
            veniam. Possimus reprehenderit itaque sequi ad repellendus tenetur
            pariatur facilis. Beatae.
          </p>
        </div>
        <div>
          <h2>Program features</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium,
            repellendus neque. Commodi repellendus, vel amet harum deleniti eum
            odit blanditiis esse! Laudantium illum reprehenderit voluptates
            quasi perferendis sed ab est.
          </p>
        </div>
        <hr />
        <div>
          <h2>Program outcomes</h2>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur
            cumque tempore incidunt perferendis esse non tenetur rerum quidem
            eligendi voluptates numquam, velit cupiditate voluptas, dicta,
            dignissimos harum saepe! Corrupti, aspernatur.
          </p>
        </div>
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'Instructors',
    render: () => (
      <Tab.Pane active={true}>
        <div className='instructors'>
          <div className='instructors__h1'>
            <h2>Program coordinators</h2>
          </div>
          <div>
            <div className='card-container'>
              <InstructorsCard />
              <InstructorsCard />
              <InstructorsCard />
            </div>
          </div>
        </div>
      </Tab.Pane>
    ),
  },
  { menuItem: 'Curriculum', render: () => <Tab.Pane>Tab 3 Content</Tab.Pane> },
  { menuItem: 'FAQs', render: () => <Tab.Pane>Tab 3 Content</Tab.Pane> },
];

const Tabs = () => {
  return (
    <>
      <Tab panes={panes} />
    </>
  );
};
export default Tabs;

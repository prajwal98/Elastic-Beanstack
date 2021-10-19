import React from 'react';
// import { Progress } from 'semantic-ui-react';
import ProgressBar from 'react-bootstrap/ProgressBar';

const Progress = ({ color, percent }) => (
  <div>
    <ProgressBar variant='warning' color='yellow' now={percent} style={{ height: '5px' }} />
  </div>
);
export default Progress;

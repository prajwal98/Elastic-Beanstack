import React from 'react';
import { Rating } from 'semantic-ui-react';

const RatingStar = () => (
  <Rating maxRating={5} defaultRating={3} icon='star' size='large' />
);

export default RatingStar;

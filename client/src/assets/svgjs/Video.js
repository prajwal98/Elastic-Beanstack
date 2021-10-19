import React from 'react';

const Video = ({ className, cls1, cls2 }) => {
  return (
    <svg
      id='Layer_1'
      data-name='Layer 1'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 120 120'
      className={className}
    >
      <path
        className={cls1}
        d='M97.85,90.5H23.77c-5.39,0-9.75-4.07-9.75-9.09V41.55c0-5,4.36-9.09,9.75-9.09H97.85c5.39,0,9.75,4.07,9.75,9.09V81.41C107.6,86.43,103.24,90.5,97.85,90.5Z'
      />
      <path
        className={cls2}
        d='M77,64.5l-29.79,17a3,3,0,0,1-4.14-.94,3.1,3.1,0,0,1-.42-1.13,7.73,7.73,0,0,1-.12-1.52V44.7c0-2,.91-3.39,2.58-3.58a3.72,3.72,0,0,1,2.12.42q15,8.45,29.89,17C79.76,60,79.66,63,77,64.5Z'
      />
    </svg>
  );
};

export default Video;

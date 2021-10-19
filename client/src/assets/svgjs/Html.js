import React from 'react';

const Html = ({ className, cls1, cls2, cls3 }) => {
  return (
    <svg
      id='Layer_1'
      data-name='Layer 1'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 120 120'
      className={className}
    >
      <defs></defs>
      <path
        className={cls1}
        d='M97.85,90.5H23.77c-5.39,0-9.75-4.07-9.75-9.09V41.55c0-5,4.36-9.09,9.75-9.09H97.85c5.39,0,9.75,4.07,9.75,9.09V81.41C107.6,86.43,103.24,90.5,97.85,90.5Z'
      />
      <g className={cls2}>
        <text className={cls3} transform='translate(18.64 73.18)'>
          H
        </text>
        <text className={cls3} transform='translate(40.82 73.18)'>
          T
        </text>
        <text className={cls3} transform='translate(58.32 73.18)'>
          ML
        </text>
      </g>
    </svg>
  );
};

export default Html;
<style></style>;

import React from "react";

const ClockOrange = ({ className, cls1, cls2 }) => {
  return (
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      className={className}
    >
      <path
        className={cls1}
        d="M60,24.45A35.55,35.55,0,1,1,24.45,60h0A35.57,35.57,0,0,1,60,24.45Z"
      />
      <path
        className={cls2}
        d="M60,40.38V62.89a1.46,1.46,0,0,0,1.47,1.46H74.74"
      />
    </svg>
  );
};

export default ClockOrange;

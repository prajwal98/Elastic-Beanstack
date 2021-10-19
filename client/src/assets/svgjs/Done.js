import React from "react";

export default function Done({
  className,
  cls1,
  cls2,
}) {
  return (
    <svg id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 25 25"
      className={className}
      ><defs>

      </defs><circle class={cls1} cx="12.5" cy="12.5" r="11.98" />
      <polygon class={cls2} points="19.97 6.06 10.03 15.76 5.04 10.64 3.49 12.14 9.92 18.94 21.51 7.62 19.97 6.06" />
    </svg>
  );
}

{
  // <style>.cls-1{fill:#1cbf04;}.cls-2{fill:#fcfcfc;}</style>
  /* <style>.cls-1,.cls-2{fill:#e35f14;}.cls-2{stroke:#fff;stroke-miterlimit:10;stroke-width:2.88px;}.cls-3{fill:#fff;}.cls-4{fill:none;stroke:#e35f14;stroke-linecap:round;stroke-linejoin:bevel;stroke-width:2.66px;}</style> */
}

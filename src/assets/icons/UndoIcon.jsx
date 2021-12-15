import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";

export default function UndoIcon() {
  return (
    <SvgIcon viewBox="0 0 15 15" style={{ width: 18 }}>
      <path
        d="M3.12207 5.01038C3.56878 3.99607 4.33721 3.1572 5.30853 2.62342C6.27984 2.08964 7.39996 1.89068 8.49568 2.05736C9.59139 2.22404 10.6017 2.74704 11.3703 3.5455C12.139 4.34397 12.6232 5.37342 12.7481 6.47469C12.873 7.57595 12.6316 8.68773 12.0613 9.63805C11.491 10.5884 10.6234 11.3243 9.59288 11.7321C8.56231 12.14 7.4261 12.1969 6.35991 11.8942C5.29373 11.5915 4.35696 10.946 3.69445 10.0574"
        stroke="#25AAE2"
        strokeWidth="2"
        strokeLinecap="square"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.78027 2.98047V6.21579H5.01559V5.18048H2.81558V2.98047H1.78027Z"
        fill="#25AAE2"
      />
    </SvgIcon>
  );
}

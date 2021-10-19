import React from "react";
import { Breadcrumb } from "semantic-ui-react";
const sections = [
  { key: "My programs", content: "My programs", link: true },
  {
    key: "MBA in Hospital Administration",
    content: "MBA in Hospital Administration",
    link: true,
  },
  {
    key: "Management principles and practice",
    content: "Management principles and practice",
    active: true,
  },
];
const BreadcrumbShorthand = () => {
  return (
    <Breadcrumb className="breadcrumb" icon="right angle" sections={sections} />
  );
};

export default BreadcrumbShorthand;

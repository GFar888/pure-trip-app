import React from "react";
import ContentLoader from "react-content-loader";

const TableSkeleton = (props) => (
  <ContentLoader
    speed={2}
    width={120}
    height={20}
    viewBox="0 0 120 20"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="15" y="0" rx="0" ry="0" width="130" height="20" />
  </ContentLoader>
);

export const Checkbox = (props) => (
  <ContentLoader
    speed={2}
    width={50}
    height={20}
    viewBox="0 0 60 20"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="20" y="0" rx="6" ry="6" width="20" height="20" />
  </ContentLoader>
);

export default TableSkeleton;

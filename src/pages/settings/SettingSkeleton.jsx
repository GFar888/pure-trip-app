import React from "react";
import ContentLoader from "react-content-loader";

const SettingSkeleton = (props) => (
  <ContentLoader
    speed={2}
    width={213}
    height={50}
    viewBox="0 0 213 50"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="19" rx="0" ry="0" width="213" height="28" />
    <rect x="0" y="2" rx="0" ry="0" width="131" height="10" />
  </ContentLoader>
);

export default SettingSkeleton;

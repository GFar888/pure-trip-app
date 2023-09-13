import React from "react";
import ContentLoader from "react-content-loader";

const Avatar_Skeleton = (props) => (
  <ContentLoader
    speed={2}
    width={125}
    height={50}
    viewBox="0 0 150 50"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <circle cx="24" cy="24" r="25" />
    <rect x="70" y="10" rx="5" ry="5" width="80" height="26" />
  </ContentLoader>
);

export default Avatar_Skeleton;

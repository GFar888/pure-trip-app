import React from "react";
import ContentLoader from "react-content-loader";

const Profile_Skeleton = (props) => (
  <ContentLoader
    speed={2}
    width={170}
    height={170}
    viewBox="0 0 170 170"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <circle cx="83" cy="83" r="83" />
  </ContentLoader>
);

export default Profile_Skeleton;

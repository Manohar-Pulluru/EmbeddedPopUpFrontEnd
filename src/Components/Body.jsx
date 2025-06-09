import React from "react";
import { Home } from "./BodyComponents/Home";
import { Orders } from "./BodyComponents/Orders";
import { Profile } from "./BodyComponents/Profile";

// Placeholder for Profile component (replace with actual Profile component)
// const Profile = () => {
//   return <div className="h-full w-full">Profile Component</div>;
// };

export const Body = ({ activeIndex, businessId }) => {
  console.log(activeIndex, "activeIndex");

  // Function to render the appropriate component based on activeIndex
  function renderComponent() {
    switch (activeIndex) {
      case 0:
        return <Home businessId={businessId} />;
      case 1:
        return <Orders />;
      case 2:
        return <Profile />;
      default:
        return <Home />;
    }
  }

  return (
    <div className="h-full sm:block  w-full fl">{renderComponent()}</div>
  );
};

export default Body;

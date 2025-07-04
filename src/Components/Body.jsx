import React, { useContext } from "react";
import { Home } from "./BodyComponents/Home";
import { Orders } from "./BodyComponents/Orders";
import { Profile } from "./BodyComponents/Profile";
import { AppContext } from "../Service/Context/AppContext";

// Placeholder for Profile component (replace with actual Profile component)
// const Profile = () => {
//   return <div className="h-full w-full">Profile Component</div>;
// };

export const Body = () => {
  const {activeIndex} =  useContext(AppContext);

  // Function to render the appropriate component based on activeIndex
  function renderComponent() {
    switch (activeIndex) {
      case 0:
        return <Home />;
      case 1:
        return <Home />;
      case 2:
        return <Orders />;
      default:
        return <Profile />;
    }
  }

  return (
    <div className="h-full sm:block  w-full">{renderComponent()}</div>
  );
};

export default Body;

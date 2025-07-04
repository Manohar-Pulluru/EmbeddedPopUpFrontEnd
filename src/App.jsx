// import React from "react";
// import { Home } from "./Components/Home";
// import { useState, useEffect } from "react";
// import { useAppContext } from "./Service/Context/AppContext";

// const App = () => {
//   // const [businessId, setBusinessId] = useState(null);
//   const {
//     showFlyerTemplate,
//     setShowFlyerTemplate,
//     flyerTemplateId,
//     setFlyerTemplateId,
//     businessId,
//     setBusinessId
//   } = useAppContext();

//   console.log("businessId:", businessId);

//   // Handle incoming messages
//   useEffect(() => {
//     const handleMessage = (event) => {
//       if (event.data.businessId) {
//         console.log(
//           "Received Details:",
//           event.data.businessId,
//           event.data.backendUrl,
//           event.data.showFlyer,
//           event.data.flyerId
//         );
//         if (event.data.showFlyer) {
//           setShowFlyerTemplate(true);
//           setFlyerTemplateId(event.data.flyerId);

//           console.log(showFlyerTemplate, "showFlyerTemplate");
//         }

//         localStorage.setItem("backendUrl", event.data.backendUrl);
//         console.log("Local item set", localStorage.getItem("backendUrl"));

//         setBusinessId(event.data.businessId);
//       }
//     };

//     window.addEventListener("message", handleMessage);
//     return () => window.removeEventListener("message", handleMessage);
//   }, [setShowFlyerTemplate, setFlyerTemplateId, businessId]); // Add setShowFlyerTemplate to dependency array

//   // Log showFlyerTemplate when it changes
//   useEffect(() => {
//     console.log(
//       "showFlyerTemplate updated:",
//       showFlyerTemplate,
//       flyerTemplateId
//     );
//   }, [showFlyerTemplate, flyerTemplateId]);

//   return (
//     <div className="w-screen h-screen flex items-center justify-center bg-[#252836]">
//       <Home businessId={businessId} />
//     </div>
//   );
// };

// export default App;

import React from "react";
import { Home } from "./Components/Home";
import { useState, useEffect } from "react";
import { useAppContext } from "./Service/Context/AppContext";

const App = () => {
  // const businessId = "91182be9-9446-4e29-9ade-b0312b238668";
  // const businessId = "5d118426-7ff9-40d8-a2f1-476d859da48e";
  const {
    showFlyerTemplate,
    setShowFlyerTemplate,
    flyerTemplateId,
    setFlyerTemplateId,
    businessId,
    setBusinessId,
  } = useAppContext();

  useEffect(() => {
    setBusinessId("91182be9-9446-4e29-9ade-b0312b238668");
    localStorage.setItem("backendUrl", "https://qa3.getafto.com/backend");
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#252836]">
      <Home businessId={businessId} />
    </div>
  );
};

export default App;

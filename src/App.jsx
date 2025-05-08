// import React from "react";
// import { Home } from "./Components/Home";
// import { useState, useEffect } from "react";

// const App = () => {

//   const [businessId, setBusinessId] = useState(null);

//   useEffect(() => {
//     const handleMessage = (event) => {
//       // Ensure it's from the expected origin (change port if needed)
//       if (event.origin !== "http://127.0.0.1:5500") return;

//       if (event.data.businessId) {
//         console.log("Received businessId:", event.data.businessId);
//         setBusinessId(event.data.businessId);
//       }
//     };

//     window.addEventListener("message", handleMessage);
//     return () => window.removeEventListener("message", handleMessage);
//   }, []);

//   return (
//     <div className="w-screen h-screen flex items-center justify-center bg-[#252836]">
//       <Home />
//     </div>
//   );
// };

// export default App;


import React from "react";
import { Home } from "./Components/Home";

const App = () => {
  const businessId = "80b6fc97-aa38-46b1-bee8-a106d9b7cd96";

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#252836]">
      <Home businessId={businessId} />
    </div>
  );
};

export default App;

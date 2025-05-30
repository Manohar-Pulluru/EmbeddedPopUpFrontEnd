import React from "react";
import { Home } from "./Components/Home";
import { useState, useEffect } from "react";

const App = () => {
  const [businessId, setBusinessId] = useState(null);

  console.log("businessId:", businessId);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== import.meta.env.VITE_AFTO_FRONTEND_URL ) return;

      if (event.data.businessId) {
        console.log("Received businessId:", event.data.businessId);
        setBusinessId(event.data.businessId);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#252836]">
      <Home businessId={businessId} />
    </div>
  );
};

export default App;

// import React from "react";
// import { Home } from "./Components/Home";

// const App = () => {
//   const businessId = "91182be9-9446-4e29-9ade-b0312b238668";

//   return (
//     <div className="w-screen h-screen flex items-center justify-center bg-[#252836]">
//       <Home businessId={businessId} />
//     </div>
//   );
// };

// export default App;

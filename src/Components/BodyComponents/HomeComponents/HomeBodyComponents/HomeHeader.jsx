// import React, { useContext, useState, useRef, useEffect } from "react";
// import { AppContext } from "../../../../Service/Context/AppContext";

// export const HomeHeader = () => {
//   const { businessData, searchQuery, handleSearch, setLoginPage } =
//     useContext(AppContext);
  
//   const [isListening, setIsListening] = useState(false);
//   const [isSupported, setIsSupported] = useState(false);
//   const recognitionRef = useRef(null);

//   useEffect(() => {
//     // Check if speech recognition is supported
//     if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
//       setIsSupported(true);
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//       recognitionRef.current = new SpeechRecognition();
      
//       recognitionRef.current.continuous = false;
//       recognitionRef.current.interimResults = false;
//       recognitionRef.current.lang = 'en-US';

//       recognitionRef.current.onresult = (event) => {
//         const transcript = event.results[0][0].transcript;
//         // Create a synthetic event to match handleSearch expectations
//         const syntheticEvent = {
//           target: { value: transcript }
//         };
//         handleSearch(syntheticEvent);
//         setIsListening(false);
//       };

//       recognitionRef.current.onerror = (event) => {
//         console.error('Speech recognition error:', event.error);
//         setIsListening(false);
//       };

//       recognitionRef.current.onend = () => {
//         setIsListening(false);
//       };
//     }

//     return () => {
//       if (recognitionRef.current) {
//         recognitionRef.current.stop();
//       }
//     };
//   }, [handleSearch]);

//   const toggleVoiceSearch = () => {
//     if (!isSupported) {
//       alert('Voice search is not supported in your browser');
//       return;
//     }

//     if (isListening) {
//       recognitionRef.current.stop();
//       setIsListening(false);
//     } else {
//       recognitionRef.current.start();
//       setIsListening(true);
//     }
//   };

//   return (
//     <div className="w-full px-3 sm:px-6 py-3 sm:py-6">
//       {/* Business Info Section */}
//       <div className="mb-4 sm:mb-8">
//         <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight mb-1 sm:mb-3">
//           <span className="block truncate">
//             {businessData?.name || "Business Name"}
//           </span>
//         </h1>
//         <p className="text-xs sm:text-base lg:text-lg text-gray-300 leading-relaxed">
//           {businessData?.address || "Business Address"}
//         </p>
//       </div>

//       {/* Search and Login Section */}
//       <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 items-stretch sm:items-center">
//         {/* Search Bar */}
//         <div className="flex-1 relative">
//           <div className="bg-[#2D303E] rounded-lg sm:rounded-2xl flex items-center px-3 py-2.5 sm:py-4 shadow-lg hover:shadow-xl transition-all duration-200 border border-transparent hover:border-[#ea7c69]/20">
//             {/* Search Icon */}
//             <svg
//               className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400 mr-2.5 sm:mr-3 flex-shrink-0"
//               fill="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" />
//             </svg>
            
//             {/* Search Input */}
//             <input
//               placeholder="Search items..."
//               className="flex-1 bg-transparent text-white placeholder:text-gray-400 text-sm sm:text-base focus:outline-none"
//               value={searchQuery}
//               onChange={handleSearch}
//             />

//             {/* Voice Input Button */}
//             {isSupported && (
//               <button
//                 onClick={toggleVoiceSearch}
//                 className={`ml-2 sm:ml-3 p-2.5 sm:p-3 rounded-full transition-all duration-200 flex-shrink-0 ${
//                   isListening
//                     ? 'bg-[#ea7c69] text-white animate-pulse shadow-lg shadow-[#ea7c69]/30'
//                     : 'bg-gray-600 hover:bg-[#ea7c69] text-gray-300 hover:text-white hover:shadow-md'
//                 }`}
//                 title={isListening ? 'Listening... Click to stop' : 'Start voice search'}
//               >
//                 {isListening ? (
//                   <svg
//                     className="w-4 h-4 sm:w-5 sm:h-5"
//                     fill="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path d="M6 6h12v12H6z" />
//                   </svg>
//                 ) : (
//                   <svg
//                     className="w-4 h-4 sm:w-5 sm:h-5"
//                     fill="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
//                   </svg>
//                 )}
//               </button>
//             )}

//             {/* Clear Search Button - only show when there's text */}
//             {searchQuery && (
//               <button
//                 onClick={() => handleSearch({ target: { value: '' } })}
//                 className="ml-1 sm:ml-2 p-2.5 sm:p-3 rounded-full bg-gray-600 hover:bg-red-500 text-gray-300 hover:text-white transition-all duration-200 flex-shrink-0"
//                 title="Clear search"
//               >
//                 <svg
//                   className="w-4 h-4 sm:w-5 sm:h-5"
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
//                 </svg>
//               </button>
//             )}
//           </div>
          
//           {/* Voice feedback indicator */}
//           {isListening && (
//             <div className="absolute -bottom-8 left-0 right-0 text-center">
//               <span className="text-xs text-[#ea7c69] bg-[#2D303E] px-3 py-1 rounded-full border border-[#ea7c69]/30">
//                 🎤 Listening...
//               </span>
//             </div>
//           )}
//         </div>

//         {/* Login Button */}
//         {!localStorage.getItem("aftoAuthToken")?.length && (
//           <button
//             onClick={() => setLoginPage(true)}
//             className="bg-[#ea7c69] hover:bg-[#d96b57] active:bg-[#c75a47] text-white font-semibold px-5 sm:px-8 py-2.5 sm:py-4 rounded-lg sm:rounded-2xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl text-sm sm:text-base whitespace-nowrap"
//           >
//             Login
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

import React, { useContext } from "react";
import { AppContext } from "../../../../Service/Context/AppContext";

export const HomeHeader = () => {
  const { businessData, searchQuery, handleSearch, setLoginPage } =
    useContext(AppContext);
  return (
    <div className="w-full px-3 sm:px-6 py-3 sm:py-6">
      {/* Business Info Section */}
      <div className="mb-4 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight mb-1 sm:mb-3">
          <span className="block truncate">
            {businessData?.name || "Business Name"}
          </span>
        </h1>
        <p className="text-xs sm:text-base lg:text-lg text-gray-300 leading-relaxed">
          {businessData?.address || "Business Address"}
        </p>
      </div>

      {/* Search and Login Section */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 items-stretch sm:items-center">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <div className="bg-[#2D303E] rounded-lg sm:rounded-2xl flex items-center px-3 py-2.5 sm:py-4 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <svg
              className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400 mr-2.5 sm:mr-3 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" />
            </svg>
            <input
              placeholder="Search items..."
              className="flex-1 bg-transparent text-white placeholder:text-gray-400 text-sm sm:text-base focus:outline-none"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Login Button */}
        {!localStorage.getItem("aftoAuthToken")?.length && (
          <button
            onClick={() => setLoginPage(true)}
            className="bg-[#ea7c69] hover:bg-[#d96b57] active:bg-[#c75a47] text-white font-semibold px-5 sm:px-8 py-2.5 sm:py-4 rounded-lg sm:rounded-2xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl text-sm sm:text-base whitespace-nowrap"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

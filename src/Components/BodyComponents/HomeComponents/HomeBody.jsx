import React, { useContext, useEffect, useState } from "react";
import {
  getTemplateData,
  getTemplates,
  searchProductsElastic,
  sendChatMessage,
  searchByRetailerIds,
} from "../../../Service/api";
import { HomeHeader } from "./HomeBodyComponents/HomeHeader";
import { TemplateTabs } from "./HomeBodyComponents/TemplateTabs";
import { Section } from "./HomeBodyComponents/Section";
import { Popup } from "./HomeBodyComponents/Popup";
import { LoginPage } from "./HomeBodyComponents/LoginPage";
import itemImage from "../../../assets/default.jpg";
import { AppContext } from "../../../Service/Context/AppContext";
// import Loader from "./HomeBodyComponents/Loader";

export const HomeBody = () => {
  const {
    businessId,
    templates,
    setTemplates,
    sections,
    activeTemplateId,
    setActiveTemplateId,
    loading,
    setLoading,
    templateLoading,
    searchLoading,
    setSearchLoading,
    searchQuery,
    setShowPopup,
    setPopupMessage,
    showLoginPage,
    setLoginPage,
    setBusinessData,
    debouncedQuery,
    setDebouncedQuery,
    searchedItems,
    setSearchedItems,
    fetchData,
    showFlyerTemplate,
    flyerTemplateId,
  } = useContext(AppContext);

  // Define static Search section
  // const staticSearchSection = {
  //   sectionTitle: "Search",
  //   items: [
  //     {
  //       id: "static-item-1",
  //       itemName: "Sample Search Product",
  //       regPrice: 29.99,
  //       imageURL: "https://via.placeholder.com/150",
  //     },
  //   ],
  // };

  async function handleUserInput(text) {
    try {
      const data = await sendChatMessage(
        `9994832826_${businessId}`,
        text,
        `${businessId}`
      );
      console.log("Chatbot replied:", data);
      return data;
    } catch (err) {
      // handle error (show popup, retry, etc.)
      console.error("Error in handleUserInput:", err);
    }
  }

  function extractRetailerIds(apiResponse) {
    if (
      !apiResponse ||
      !apiResponse.response ||
      !Array.isArray(apiResponse.response.product_section)
    ) {
      return [];
    }

    return apiResponse.response.product_section.flatMap((section) =>
      section.products.map((product) => product.retailer_id)
    );
  }

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.trim() && businessId) {
        setSearchLoading(true);
        try {
          console.log("Sending search query to API:", debouncedQuery);
          // let response = null;
          // if (businessId == "80b6fc97-aa38-46b1-bee8-a106d9b7cd96") {
          //   const apiUrl = `https://qa3.getafto.com/backend/embedded/user/search-products-elastic?index=91182be9-9446-4e29-9ade-b0312b238668&search=${debouncedQuery}`;
          //   const headers = {
          //     "embedded-static-token": import.meta.env
          //       .VITE_EMBEDDED_STATIC_TOKEN,
          //   };

          //   const dataRes = await axios.get(apiUrl, { headers });

          //   response = dataRes.data;
          // } else {
          //   response = await searchProductsElastic(businessId, debouncedQuery);
          // }
          // const response = await searchProductsElastic(
          //   businessId,
          //   debouncedQuery
          // );
          const res = await handleUserInput(debouncedQuery);
          const ans = extractRetailerIds(res);
          console.log("Retailer ID's:", ans);
          const response = await searchByRetailerIds(businessId, ans);

          console.log(response.data, "Elastic Search Response");
          if (response && response.data && response.data.items) {
            const mappedItems = response.data.items.map((item) => ({
              ...item,
              id: item.retailerId, // this is giving some issues why
              imageURL: item.imageURL || itemImage,
            }));
            setSearchedItems(mappedItems);
            console.log("Mapped search results:", mappedItems);
          } else {
            setSearchedItems([]);
            console.log("No items found for query:", debouncedQuery);
          }
        } catch (error) {
          console.error("Search error:", error);
          setSearchedItems([]);
          setPopupMessage("Failed to fetch search results. Please try again.");
          setShowPopup(true);
        } finally {
          setSearchLoading(false);
        }
      } else {
        setSearchedItems(null);
        setSearchLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery, businessId]);

  // Fetch templates when businessId is available
  useEffect(() => {
    if (!businessId) return;

    const fetchTemplates = async () => {
      try {
        console.log(businessId, "businessId__1");
        const result = await getTemplates(businessId);
        setTemplates(result.templates);
        setBusinessData(result.businessData);
        if (result.templates?.length > 0) {
          const isValidTemplate = result.templates.some(
            (template) => template.id === activeTemplateId
          );
          if (!activeTemplateId || !isValidTemplate) {
            if (showFlyerTemplate) {
              setActiveTemplateId(flyerTemplateId);
            } else {
              setActiveTemplateId(result.templates[0].id);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch templates:", err);
        setPopupMessage("Failed to load templates. Please try again.");
        setShowPopup(true);
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    fetchTemplates();

    const intervalId = setInterval(() => {
      fetchTemplates();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [businessId, activeTemplateId]);

  // Fetch template data when activeTemplateId changes
  useEffect(() => {
    if (activeTemplateId) {
      fetchData();
    }
  }, [activeTemplateId]);

  // Handle search input change

  // Loader component (modern dual-ring spinner)
  // const Loader = () => (
  //   <div className="w-full h-full flex items-center justify-center">
  //     <div className="relative w-16 h-16" role="status" aria-label="Loading">
  //       <div className="absolute w-full h-full border-4 border-t-[#EA7C69] border-b-[#EA7C69] border-l-transparent border-r-transparent rounded-full animate-spin"></div>
  //       <div className="absolute w-full h-full border-4 border-t-transparent border-b-transparent border-l-[#EA7C69] border-r-[#EA7C69] rounded-full animate-spin-slow"></div>
  //     </div>
  //   </div>
  // );

  const Loader = () => (
    <div className="w-full h-full flex items-center justify-center bg-transparent">
      <div className="relative flex flex-col items-center space-y-6">
        {/* Shopping Cart Animation */}
        <div className="relative">
          {/* Cart Body */}
          <div className="w-16 h-12 border-4 border-[#EA7C69] rounded-lg relative overflow-hidden">
            {/* Animated Shopping Items */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-2 h-6 bg-[#EA7C69] rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="w-2 h-4 bg-orange-400 rounded-full animate-bounce mx-1"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-5 bg-amber-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>

            {/* Cart Handle */}
            <div className="absolute -right-2 top-0 w-4 h-8 border-l-4 border-t-4 border-[#EA7C69] rounded-tl-lg"></div>
          </div>

          {/* Cart Wheels */}
          <div className="flex justify-between absolute -bottom-2 left-1 right-1">
            <div className="w-4 h-4 bg-[#EA7C69] rounded-full animate-spin"></div>
            <div className="w-4 h-4 bg-[#EA7C69] rounded-full animate-spin"></div>
          </div>

          {/* Floating Price Tags */}
          <div className="absolute -top-8 -left-4 w-6 h-4 bg-green-500 rounded-sm animate-pulse opacity-75 flex items-center justify-center">
            <span className="text-xs text-white font-bold">$</span>
          </div>
          <div
            className="absolute -top-6 -right-6 w-6 h-4 bg-red-500 rounded-sm animate-pulse opacity-75 flex items-center justify-center"
            style={{ animationDelay: "0.5s" }}
          >
            <span className="text-xs text-white font-bold">%</span>
          </div>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#EA7C69] to-orange-400 rounded-full animate-pulse origin-left transform scale-x-75"></div>
        </div>

        {/* Loading Text with Dots */}
        <div className="flex items-center space-x-2 text-[#EA7C69] font-semibold">
          <span>Finding best deals</span>
          <div className="flex space-x-1">
            <div
              className="w-1 h-1 bg-[#EA7C69] rounded-full animate-bounce"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="w-1 h-1 bg-[#EA7C69] rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-1 h-1 bg-[#EA7C69] rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Credit Card */}
          <div className="absolute top-1/4 left-1/4 w-8 h-5 bg-blue-500 rounded opacity-20 animate-float">
            <div className="w-full h-1 bg-yellow-400 mt-1 rounded"></div>
          </div>

          {/* Package Box */}
          <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-amber-600 rounded opacity-20 animate-float-delayed">
            <div className="w-full h-1 bg-amber-800 mt-2"></div>
            <div className="w-1 h-full bg-amber-800 ml-2 absolute top-0"></div>
          </div>

          {/* Heart (Wishlist) */}
          <div className="absolute bottom-1/4 left-1/3 w-4 h-4 opacity-20 animate-pulse">
            <div className="w-full h-full bg-red-500 rounded-full relative">
              <div className="absolute -top-1 -left-1 w-2 h-3 bg-red-500 rounded-full"></div>
              <div className="absolute -top-1 -right-1 w-2 h-3 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(-3deg);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );

  // Handle adding item to cart

  return (
    <div className="h-full w-full px-2 pt-4 flex flex-col">
      {/* Header */}
      <HomeHeader />

      {/* Template Tabs */}

      {!searchQuery.length && <TemplateTabs />}

      {/* Body Content */}
      <div className="w-full mt-8 h-[82%] overflow-hidden relative">
        <Popup />

        <div className="w-full h-full px-8 overflow-y-scroll scrollbar-hide">
          {loading || templateLoading || searchLoading ? (
            <Loader />
          ) : debouncedQuery.trim() ? (
            searchedItems?.length === 0 ? (
              <div className="w-full text-center text-xl text-[#ffffffaf]">
                No items found for "{debouncedQuery}"
              </div>
            ) : (
              <Section
                section={{
                  sectionTitle: "Search Results",
                  items: searchedItems,
                }}
              />
            )
          ) : (
            <>
              {templates?.length > 0 && sections?.length > 0 ? (
                sections.map((section, index) => (
                  <Section key={index} section={section} />
                ))
              ) : templates?.length === 0 ? (
                <div className="w-full text-center text-xl text-[#ffffffaf]">
                  No template available
                </div>
              ) : (
                <div className="w-full text-center text-xl text-[#ffffffaf]">
                  No items available for this template
                </div>
              )}

              {/* Static Search Section */}
              {/* <Section section={staticSearchSection} /> */}
            </>
          )}
        </div>
      </div>

      {showLoginPage ? (
        <div className="fixed h-screen w-screen top-0 z-10 left-0 bg-[#00000065]">
          <LoginPage businessId={businessId} setLoginPage={setLoginPage} />
        </div>
      ) : null}
    </div>
  );
};

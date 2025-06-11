import React, { useContext, useEffect, useState } from "react";
import {
  getTemplateData,
  getTemplates,
  searchProductsElastic,
} from "../../../Service/api";
import { HomeHeader } from "./HomeBodyComponents/HomeHeader";
import { TemplateTabs } from "./HomeBodyComponents/TemplateTabs";
import { Section } from "./HomeBodyComponents/Section";
import { Popup } from "./HomeBodyComponents/Popup";
import { LoginPage } from "./HomeBodyComponents/LoginPage";
import itemImage from "../../../assets/default.jpg";
import { AppContext } from "../../../Service/Context/AppContext";

export const HomeBody = () => {
  const {
    businessId,
    templates,
    setTemplates,
    sections,
    setSections,
    activeTemplateId,
    setActiveTemplateId,
    templateData,
    setTemplateData,
    loading,
    setLoading,
    templateLoading,
    setTemplateLoading,
    searchLoading,
    setSearchLoading,
    searchQuery,
    setSearchQuery,
    quantity,
    setQuantity,
    itemLoading,
    setItemLoading,
    itemAdded,
    setItemAdded,
    showPopup,
    setShowPopup,
    popupMessage,
    setPopupMessage,
    showLoginPage,
    setLoginPage,
    businessData,
    setBusinessData,
    debouncedQuery,
    setDebouncedQuery,
    searchedItems,
    setSearchedItems,
    fetchResults,
    fetchTemplates,
    fetchData,
    handleAddToCart,
    showPayment,
    toggleChangeCart
  } = useContext(AppContext);

  // Define static Search section
  const staticSearchSection = {
    sectionTitle: "Search",
    items: [
      {
        id: "static-item-1",
        itemName: "Sample Search Product",
        regPrice: 29.99,
        imageURL: "https://via.placeholder.com/150",
      },
    ],
  };

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Fetch search results
  useEffect(() => {
    fetchResults();
  }, [debouncedQuery, businessId]);

  // Fetch templates when businessId is available
  useEffect(() => {
    if (!businessId) return;

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
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Loader component (modern dual-ring spinner)
  const Loader = () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-16 h-16" role="status" aria-label="Loading">
        <div className="absolute w-full h-full border-4 border-t-[#EA7C69] border-b-[#EA7C69] border-l-transparent border-r-transparent rounded-full animate-spin"></div>
        <div className="absolute w-full h-full border-4 border-t-transparent border-b-transparent border-l-[#EA7C69] border-r-[#EA7C69] rounded-full animate-spin-slow"></div>
      </div>
    </div>
  );

  // Handle adding item to cart

  // Close popup manually
  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="h-full w-full px-8 pt-4 flex flex-col">
      {/* Header */}
      <HomeHeader
        businessData={businessData}
        setLoginPage={setLoginPage}
        searchQuery={searchQuery}
        handleSearch={handleSearch}
      />

      {/* Template Tabs */}

      {!searchQuery.length && (
        <TemplateTabs
          templates={templates}
          activeTemplateId={activeTemplateId}
          setActiveTemplateId={setActiveTemplateId}
        />
      )}

      {/* Body Content */}
      <div className="w-full mt-8 h-[82%] overflow-hidden relative">
        <Popup
          showPopup={showPopup}
          popupMessage={popupMessage}
          closePopup={closePopup}
        />

        <div className="w-full h-[90%] px-8 overflow-y-scroll scrollbar-hide">
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
                showPayment={showPayment}
                handleAddToCart={handleAddToCart}
                itemLoading={itemLoading}
                itemAdded={itemAdded}
              />
            )
          ) : (
            <>
              {templates?.length > 0 && sections?.length > 0 ? (
                sections.map((section, index) => (
                  <Section
                    key={index}
                    section={section}
                    showPayment={showPayment}
                    handleAddToCart={handleAddToCart}
                    itemLoading={itemLoading}
                    itemAdded={itemAdded}
                  />
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
              <Section
                section={staticSearchSection}
                showPayment={showPayment}
                handleAddToCart={handleAddToCart}
                itemLoading={itemLoading}
                itemAdded={itemAdded}
              />
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

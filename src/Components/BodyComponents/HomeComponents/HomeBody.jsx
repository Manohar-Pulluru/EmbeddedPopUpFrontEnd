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
import axios from "axios";

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
    // fetchResults,
    // fetchTemplates,
    fetchData,
    handleAddToCart,
    showPayment,
    toggleChangeCart,
    handleSearch,
    showFlyerTemplate,
    flyerTemplateId
  } = useContext(AppContext);
// import { useAppContext } from "../../../Service/Context/AppContext";
// import axios from "axios";

// export const HomeBody = ({ showPayment, toggleChangeCart, businessId }) => {
//   const [templates, setTemplates] = useState([]);
//   const [sections, setSections] = useState([]);
//   const [activeTemplateId, setActiveTemplateId] = useState("");
//   const [templateData, setTemplateData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [templateLoading, setTemplateLoading] = useState(false);
//   const [searchLoading, setSearchLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [quantity, setQuantity] = useState(1);
//   const [itemLoading, setItemLoading] = useState({});
//   const [itemAdded, setItemAdded] = useState({});
//   const [showPopup, setShowPopup] = useState(false);
//   const [popupMessage, setPopupMessage] = useState("");
//   const [showLoginPage, setLoginPage] = useState(false);
//   const [businessData, setBusinessData] = useState(null);
//   const [debouncedQuery, setDebouncedQuery] = useState("");
//   const [searchedItems, setSearchedItems] = useState(null);
//   const { showFlyerTemplate, flyerTemplateId } = useAppContext();

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
    const fetchResults = async () => {
      if (debouncedQuery.trim() && businessId) {
        setSearchLoading(true);
        try {
          console.log("Sending search query to API:", debouncedQuery);
          let response = null;
          if (businessId == "80b6fc97-aa38-46b1-bee8-a106d9b7cd96") {
            const apiUrl = `https://qa3.getafto.com/backend/embedded/user/search-products-elastic?index=91182be9-9446-4e29-9ade-b0312b238668&search=${debouncedQuery}`;
            const headers = {
              "embedded-static-token": import.meta.env
                .VITE_EMBEDDED_STATIC_TOKEN,
            };

            const dataRes = await axios.get(apiUrl, { headers });

            response = dataRes.data;
          } else {
            response = await searchProductsElastic(businessId, debouncedQuery);
          }

          console.log(response.data, "Elastic Search Response");
          if (response && response.data && response.data.items) {
            const mappedItems = response.data.items.map((item) => ({
              ...item,
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
  const Loader = () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-16 h-16" role="status" aria-label="Loading">
        <div className="absolute w-full h-full border-4 border-t-[#EA7C69] border-b-[#EA7C69] border-l-transparent border-r-transparent rounded-full animate-spin"></div>
        <div className="absolute w-full h-full border-4 border-t-transparent border-b-transparent border-l-[#EA7C69] border-r-[#EA7C69] rounded-full animate-spin-slow"></div>
      </div>
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
              <Section section={staticSearchSection} />
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

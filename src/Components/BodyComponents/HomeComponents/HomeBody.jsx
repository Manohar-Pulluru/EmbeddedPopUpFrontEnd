import React, { useEffect, useState } from "react";
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
import { useAppContext } from "../../../Service/Context/AppContext";
import axios from "axios";

export const HomeBody = ({ showPayment, toggleChangeCart, businessId }) => {
  const [templates, setTemplates] = useState([]);
  const [sections, setSections] = useState([]);
  const [activeTemplateId, setActiveTemplateId] = useState("");
  const [templateData, setTemplateData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [itemLoading, setItemLoading] = useState({});
  const [itemAdded, setItemAdded] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showLoginPage, setLoginPage] = useState(false);
  const [businessData, setBusinessData] = useState(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchedItems, setSearchedItems] = useState(null);
  const { showFlyerTemplate, flyerTemplateId } = useAppContext();

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
      const fetchData = async () => {
        setTemplateLoading(true);
        try {
          const result = await getTemplateData(activeTemplateId);
          const data = result.data;
          setTemplateData(data);
          setSections(data.sections);
        } catch (err) {
          console.error("Failed to fetch template data:", err);
          setPopupMessage("Failed to load template data. Please try again.");
          setShowPopup(true);
        } finally {
          setTemplateLoading(false);
        }
      };

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
  const handleAddToCart = (item) => {
    setItemLoading((prev) => ({ ...prev, [item.id]: true }));
    setShowPopup(false);

    setTimeout(() => {
      setItemLoading((prev) => ({ ...prev, [item.id]: false }));
      setItemAdded((prev) => ({ ...prev, [item.id]: true }));
      setQuantity(1);

      let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const existingItemIndex = cartItems.findIndex(
        (cartItem) => cartItem.id === item.id || cartItem.itemId === item.id
      );

      if (existingItemIndex !== -1) {
        setPopupMessage(`Item "${item.itemName}" already in cart!`);
        setShowPopup(true);
      } else {
        const newItem = {
          id: item.id,
          itemId: item.id,
          itemName: item.itemName,
          regPrice: item.regPrice,
          imageURL: item.imageURL,
          quantity: 1,
        };
        cartItems.push(newItem);
        toggleChangeCart();
      }

      cartItems = cartItems.map((cartItem) => ({
        ...cartItem,
        totalPrice:
          (parseFloat(cartItem.regPrice || 0) || 0) * cartItem.quantity,
      }));

      localStorage.setItem("cartItems", JSON.stringify(cartItems));

      setTimeout(() => {
        setItemAdded((prev) => ({ ...prev, [item.id]: false }));
      }, 1000);

      if (showPopup) {
        setTimeout(() => setShowPopup(false), 3000);
      }
    }, 500);
  };

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

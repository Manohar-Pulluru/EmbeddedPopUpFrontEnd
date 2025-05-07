import React, { useEffect, useState } from "react";
import { getTemplateData, getTemplates } from "../../../Service/api";
import { HomeHeader } from "./HomeBodyComponents/HomeHeader";
import { TemplateTabs } from "./HomeBodyComponents/TemplateTabs";
import { Section } from "./HomeBodyComponents/Section";
import { Popup } from "./HomeBodyComponents/Popup";
import { LoginPage } from "./HomeBodyComponents/LoginPage";

export const HomeBody = ({ showPayment, toggleChangeCart }) => {
  const [templates, setTemplates] = useState([]);
  const [sections, setSections] = useState([]);
  const [activeTemplateId, setActiveTemplateId] = useState("");
  const [templateData, setTemplateData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [itemLoading, setItemLoading] = useState({});
  const [itemAdded, setItemAdded] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showLoginPage, setLoginPage] = useState(false);
  const [businessData, setBusinessData] = useState(null);
  const [businessId, setBusinessId] = useState(() => {
    // Initialize businessId from localStorage if available
    return localStorage.getItem("businessId") || null;
  });

  // Listen for postMessage from parent window
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== "http://127.0.0.1:5500") return;

      if (event.data.businessId) {
        console.log("Received businessId:", event.data.businessId);
        setBusinessId(event.data.businessId);
        // Store businessId in localStorage
        localStorage.setItem("businessId", event.data.businessId);
      }
    };

    window.addEventListener("message", handleMessage);

    // Request businessId from parent window on mount
    window.parent.postMessage({ action: "requestBusinessId" }, "http://127.0.0.1:5500");

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Fetch templates when businessId is available
  useEffect(() => {
    const fetchTemplates = async () => {
      if (!businessId) return;
      setLoading(true);
      try {
        console.log(businessId, "businessId__1");
        const result = await getTemplates(businessId);
        setTemplates(result.templates);
        setBusinessData(result.businessData);
        if (result.templates.length > 0) {
          setActiveTemplateId(result.templates[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch templates:", err);
        setPopupMessage("Failed to load templates. Please try again.");
        setShowPopup(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [businessId]);

  // Fetch template data when activeTemplateId changes
  useEffect(() => {
    if (activeTemplateId) {
      const fetchData = async () => {
        setLoading(true);
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
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [activeTemplateId]);

  // Handle search input change
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Loader component
  const Loader = () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#EA7C69]"></div>
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
      <TemplateTabs
        templates={templates}
        activeTemplateId={activeTemplateId}
        setActiveTemplateId={setActiveTemplateId}
      />

      {/* Body Content */}
      <div className="w-full h-[82%] overflow-hidden relative">
        <Popup
          showPopup={showPopup}
          popupMessage={popupMessage}
          closePopup={closePopup}
        />

        <div className="w-full mt-8 h-[90%] px-8 overflow-y-scroll scrollbar-hide">
          {loading ? (
            <Loader />
          ) : sections.length > 0 ? (
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
          ) : (
            <div className="w-full text-center text-xl text-[#ffffffaf]">
              No sections available
            </div>
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
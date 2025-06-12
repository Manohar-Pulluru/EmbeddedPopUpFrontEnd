import { useState } from "react";
import {
  getUserAddress,
  getTemplateData,
  getTemplates,
  searchProductsElastic,
  calculateDeliveryCharge,
  placeOrder
} from "../api";
import { jwtDecode } from "jwt-decode";

export const useAppStates = () => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);
  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const [isCartChanged, setIsCartChanged] = useState(false);

  const toggleCart = () => {
    setIsCartChanged(!isCartChanged);
  };

  // App.jsx
  // const businessId = "5d118426-7ff9-40d8-a2f1-476d859da48e";
  // const businessAccountId = "5d118426-7ff9-40d8-a2f1-476d859da48e";
  
  const businessId = "91182be9-9446-4e29-9ade-b0312b238668";
  const businessAccountId = "91182be9-9446-4e29-9ade-b0312b238668";

  // Home.jsx
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // navBar.jsx
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  // bodyComponents/Home.jsx
  const [showPayment, setShowPayment] = useState(false);
  const [changeCart, setChangeCart] = useState(false);
  const [items, setItems] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerWhatsappNumber, setCustomerWhatsappNumber] = useState("");
  const [orderData, setOrderData] = useState({}); // Initialize as empty
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [mode, setMode] = useState("delivery");

  const toggleChangeCart = () => {
    setChangeCart(!changeCart);
  };

  // HomeBody.jsx
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

  const fetchResults = async () => {
    if (debouncedQuery.trim() && businessId) {
      setSearchLoading(true);
      try {
        console.log("Sending search query to API:", debouncedQuery);
        const response = await searchProductsElastic(
          businessId,
          debouncedQuery
        );
        console.log(response.data, "Elastic Search Response");
        if (response && response.data && response.data.items) {
          const mappedItems = response.data.items.map((item) => ({
            ...item,
            imageURL: item.imageURL || itemImage,
          }));
          setSearchedItems(mappedItems);
          console.log("Mapped search results:", mappedItems);
          console.log("Search results updated:", searchedItems);
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
          setActiveTemplateId(result.templates[0].id);
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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Close popup manually
  const closePopup = () => {
    setShowPopup(false);
  };

  // Qrders.jsx
  const [activeTab, setActiveTab] = useState("Cart");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const [isFormValid, setIsFormValid] = useState(false); // New state for form validity
  const tabs = ["Cart", "Details", "Delivery"];
  const [discount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryResult, setDeliveryResult] = useState(null);
  const [restrauntAddress, setRestrauntAddress] = useState(null);

  const calculateSubtotal = (items, deliveryCharge = 0) => {
    return (
      items.reduce((sum, item) => sum + (item.totalPrice || 0), 0) +
      deliveryCharge
    );
  };

    const fetchAddress = async () => {
    const token = localStorage.getItem("aftoAuthToken");
    if (!token) {
      console.log("No token found in localStorage");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const email = decodedToken.email;
      const businessId = localStorage.getItem("aftoAuthBusinessId");

      if (!email || !businessId) {
        console.log("Email or businessId missing");
        return;
      }

      const payload = {
        email,
        businessAccountId: businessId,
      };

      console.log("Fetching address with payload:", payload);
      const response = await getUserAddress(payload);

      if (response?.embeddedUser?.otherDetails) {
        const { name, email, phone, address, city, pincode, state } =
          response.embeddedUser.otherDetails;
        setName(name || "");
        setEmail(email || "");
        setPhone(phone || "");
        setAddress(address || "");
        setCity(city || "");
        setPincode(pincode || "");
        setState(state || "");
        console.log("Address data set:", response.embeddedUser.otherDetails);
      } else {
        console.log("No address data in response");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const handleQuantityChange = (id, value) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const newQuantity = Math.max(1, Number(value) || 1);
        const newTotalPrice = parseFloat(item.regPrice) * newQuantity;
        return {
          ...item,
          quantity: newQuantity,
          totalPrice: newTotalPrice,
        };
      }
      return item;
    });
    setItems(updatedItems);
    setSubtotal(calculateSubtotal(updatedItems, deliveryCharge));

    const itemsForStorage = updatedItems.map((item) => ({
      id: item.id,
      itemId: item.itemId,
      itemName: item.itemName,
      regPrice: item.regPrice.toString(),
      imageURL: item.imageURL,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
      note: item.note,
    }));
    localStorage.setItem("cartItems", JSON.stringify(itemsForStorage));
  };

  const handleNoteChange = (id, note) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, note } : item
    );
    setItems(updatedItems);

    const itemsForStorage = updatedItems.map((item) => ({
      id: item.id,
      itemId: item.itemId,
      itemName: item.itemName,
      regPrice: item.regPrice.toString(),
      imageURL: item.imageURL,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
      note: item.note,
    }));
    localStorage.setItem("cartItems", JSON.stringify(itemsForStorage));
  };

  const handleDelete = (id) => {
    toggleCart();
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    setSubtotal(calculateSubtotal(updatedItems, deliveryCharge));

    const itemsForStorage = updatedItems.map((item) => ({
      id: item.id,
      itemId: item.itemId,
      itemName: item.itemName,
      regPrice: item.regPrice.toString(),
      imageURL: item.imageURL,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
      note: item.note,
    }));
    localStorage.setItem("cartItems", JSON.stringify(itemsForStorage));
  };

  const handleNext = async () => {
    if (activeTab === "Cart") {
      setActiveTab("Details");
    } else if (activeTab === "Details" && isFormValid) {
      // fetchDeliveryDetails();

      // getTemplates(businessAccountId).then((response) => {
      //   // console.log("Templates fetched successfully:", response);
      //   // console.log(response.businessData.address)
      //   // setRestrauntAddress(response.businessData.address);
      //   setRestrauntAddress(
      //     "2275 Britannia Rd W unit 15, Mississauga, ON L5M 2G6, Canada"
      //   );
      // });

      // const response = await getTemplates(businessAccountId);
      // const res = await calculateDeliveryCharge(
      //   response.businessData.address,
      //   address + " " + city + " " + state + " " + pincode
      // );
      const res = await calculateDeliveryCharge(
        restrauntAddress,
        address + " " + city + " " + state + " " + pincode
      );
      console.log("Restaurant Address:", restrauntAddress);
      console.log("Customer Address:", address, city, pincode, state);

      // const res = await calculateDeliveryCharge(restrauntAddress, address);
      setDeliveryResult(res);
      setDeliveryCharge(res.delivery_charge || 0);
      // console.log("Delivery Result:", res);
      setActiveTab("Delivery");
    } else if (activeTab === "Delivery" && isFormValid) {
      // Only proceed if form is valid
      // Update customer details
      setCustomerName(name);
      setCustomerWhatsappNumber(phone);

      // Construct orderData with user-provided values only
      const updatedOrderData = {
        customerName: name,
        customerWhatsappNumber: phone,
        customerEmail: email,
        businessAccountId: businessAccountId,
        deliveryCharges: deliveryCharge,
        deliveryType: "delivery",
        items: items.map((item, index) => ({
          id: item.id,
          sectionTitle: "Rice", // Adjust as needed
          itemId: item.itemId,
          itemName: item.itemName,
          itemDescription: `${item.itemName}.`,
          regPrice: item.regPrice.toString(),
          salePrice: "0",
          imageURL: item.imageURL,
          serial_number: index + 1,
          productTemplateSectionId: "20903f70-bc7a-48f0-89fc-07bbede56cf1",
          isHSTApplied: false,
          HSTPercentage: "13.00",
          inventoryId: null,
          inventoryName: null,
          isSyncToInventory: false,
          createdAt: "2025-04-18T14:23:31.222Z",
          updatedAt: "2025-04-18T14:23:31.222Z",
          quantity: item.quantity,
        })),
      };

      setOrderData(updatedOrderData);
      console.log("Updated orderData:", updatedOrderData);

      // Place the order
      setIsLoading(true);
      try {
        const response = await placeOrder(updatedOrderData);
        let orderHistory = JSON.parse(
          localStorage.getItem("orderHistory") || "[]"
        );
        orderHistory.push(response.data);
        localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
        // localStorage.setItem("cartItems", JSON.stringify([]));
        // setItems([]); // Clear items in state
        setShowPayment(true);
        setPaymentDetails(response.data.paymentIntent);
        console.log(showPayment, "showPayment", response.data.paymentIntent);
        toggleCart();
      } catch (error) {
        console.error("Failed to place order:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const isTabDisabled = (tab) => {
    if (activeTab === "Cart") {
      return tab !== "Cart";
    }
    return false;
  };

  return {
    user,
    login,
    logout,
    theme,
    toggleTheme,
    toggleCart,
    isCartChanged,
    businessId,
    isMobile,
    setIsMobile,
    activeIndex,
    setActiveIndex,
    showPayment,
    setShowPayment,
    changeCart,
    setChangeCart,
    items,
    setItems,
    customerName,
    setCustomerName,
    customerWhatsappNumber,
    setCustomerWhatsappNumber,
    orderData,
    setOrderData,
    paymentDetails,
    setPaymentDetails,
    subtotal,
    setSubtotal,
    deliveryCharge,
    setDeliveryCharge,
    mode,
    setMode,
    toggleChangeCart,
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
    activeTab,
    setActiveTab,
    name,
    setName,
    phone,
    setPhone,
    email,
    setEmail,
    address,
    setAddress,
    city,
    setCity,
    pincode,
    setPincode,
    state,
    setState,
    isFormValid,
    setIsFormValid,
    tabs,
    discount,
    isLoading,
    setIsLoading,
    deliveryResult,
    setDeliveryResult,
    restrauntAddress,
    setRestrauntAddress,
    calculateSubtotal,
    fetchAddress,
    handleQuantityChange,
    handleNoteChange,
    handleDelete,
    handleNext,
    isTabDisabled,
    businessAccountId,
    handleSearch,
    closePopup,
    isCartOpen,
    setIsCartOpen,
  };
};

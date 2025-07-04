import { useState, useEffect } from "react";
import {
  getUserAddress,
  getTemplateData,
  getTemplates,
  searchProductsElastic,
  calculateDeliveryCharge,
  placeOrder,
  updateCartItemQuantity,
  deleteCartItem,
  confirmOrder,
  getCartItems,
} from "../api";
import { jwtDecode } from "jwt-decode";

export const useAppStates = () => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");
  const [showFlyerTemplate, setShowFlyerTemplate] = useState(false);
  const [flyerTemplateId, setFlyerTemplateId] = useState(null);

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

  // const businessId = "91182be9-9446-4e29-9ade-b0312b238668";
  // const businessAccountId = "91182be9-9446-4e29-9ade-b0312b238668";
  const [businessId, setBusinessId] = useState(null);
  // const [businessId, setBusinessId] = useState("ddb91055-b5de-4d6f-a55a-3d8584c2c630");
  // const [businessId, setBusinessId] = useState(
  //   "91182be9-9446-4e29-9ade-b0312b238668"
  // );
  // const [businessId, setBusinessId] = useState("5d118426-7ff9-40d8-a2f1-476d859da48e");
  // const [businessId, setBusinessId] = useState(
  //   "91182be9-9446-4e29-9ade-b0312b238668"
  // );
  // const [businessId, setBusinessId] = useState(
  //   "5d118426-7ff9-40d8-a2f1-476d859da48e"
  // );

  // Home.jsx
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

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
  const [mode, setMode] = useState("Pick Up");

  const toggleChangeCart = () => {
    console.log("cart changed");
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
      // console.log("Section data", data.id);
    } catch (err) {
      console.error("Failed to fetch template data:", err);
      setPopupMessage("Failed to load template data. Please try again.");
      setShowPopup(true);
    } finally {
      setTemplateLoading(false);
    }
  };

  const addItemLocal = (item) => {
    console.log("Added to local");
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const existingItemIndex = cartItems.findIndex(
      (cartItem) => cartItem.id === item.id || cartItem.itemId === item.id
    );

    if (existingItemIndex !== -1) {
      setPopupMessage(`Item "${item.itemName}" already in cart!`);
      // setShowPopup(true);
    } else {
      const newItem = {
        id: item.id,
        itemId: item.id,
        itemName: item.itemName,
        itemRegPrice: item.itemRegPrice,
        imageURL: item.imageURL,
        quantity: 1,
      };
      cartItems.push(newItem);
      toggleChangeCart();
      toggleCart();
    }

    cartItems = cartItems.map((cartItem) => ({
      ...cartItem,
      totalPrice:
        (parseFloat(cartItem.itemRegPrice || 0) || 0) * cartItem.quantity,
    }));

    console.log("CARTTT add:", cartItems, item.id);

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  };

  const removeItemLocal = (itemId) => {
    console.log("Removed from local");
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    console.log("CARTTTT before: ", cartItems, itemId);
    const filteredItems = cartItems.filter((cartItem) => {
      console.log("Delete", cartItem.itemId, itemId);
      return cartItem.itemId !== itemId;
    });
    console.log("CARTTTT after: ", filteredItems);

    // 3. If nothing was removed, show a popup
    if (filteredItems.length === cartItems.length) {
      // setPopupMessage(`Item not found in cart!`);
      // setShowPopup(true);
      console.log("Delete Failed: ", itemId);
      return;
    }

    // 4. Otherwise, update the cart and notify
    toggleChangeCart();
    toggleCart();

    // 5. Recalculate totals
    const updatedItems = filteredItems.map((ci) => ({
      ...ci,
      totalPrice: (parseFloat(ci.itemRegPrice || 0) || 0) * (ci.quantity || 1),
    }));

    // 6. Persist back to localStorage
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
  };

  const refreshItemLocal = () => {
    const cartOrderId = localStorage.getItem("cartOrderId");
    if (!cartOrderId) {
      setLoading(false);
      return;
    }
    // localStorage.removeItem("cartItems");
    getCartItems(cartOrderId)
      .then((response) => {
        // const normalized = (response.orderItems || []).map((i) => {
        //   addItemLocal({
        //     id: i.id,
        //     // itemId: i.productRetailerId,
        //     itemId: i.itemId,
        //     itemName: i.itemName,
        //     // convert the string price to a number
        //     itemRegPrice: parseFloat(i.itemRegPrice) || 0,
        //     // align naming
        //     imageURL: i.imageUrl,
        //     quantity: i.quantity,
        //     // precompute total if you like
        //     totalPrice: (parseFloat(i.itemRegPrice) || 0) * i.quantity,
        //   });
        //   return {
        //       id: i.id,
        //       // itemId: i.productRetailerId,
        //       itemId: i.itemId,
        //       itemName: i.itemName,
        //       // convert the string price to a number
        //       itemRegPrice: parseFloat(i.itemRegPrice) || 0,
        //       // align naming
        //       imageURL: i.imageUrl,
        //       quantity: i.quantity
        //     }
        // });
        const serverItems = response.orderItems || [];
        const updatedCart = serverItems.map((i) => ({
          id: i.id,
          itemId: i.itemId,
          itemName: i.itemName,
          itemRegPrice: parseFloat(i.itemRegPrice) || 0,
          imageURL: i.imageUrl,
          quantity: i.quantity,
          totalPrice: (parseFloat(i.itemRegPrice) || 0) * i.quantity,
        }));

        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        // setItems(normalized);
      })
      .catch((err) => {
        console.error("Failed to load cart:", err);
        setError("Unable to fetch cart items");
      });
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
          itemRegPrice: item.itemRegPrice,
          imageURL: item.imageURL,
          quantity: 1,
        };
        cartItems.push(newItem);
        toggleChangeCart();
      }

      cartItems = cartItems.map((cartItem) => ({
        ...cartItem,
        totalPrice:
          (parseFloat(cartItem.itemRegPrice || 0) || 0) * cartItem.quantity,
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
  // const [name, setName] = useState("");
  // const [phone, setPhone] = useState("");
  // const [email, setEmail] = useState("");
  // const [address, setAddress] = useState("");
  // const [city, setCity] = useState("");
  // const [pincode, setPincode] = useState("");
  // const [state, setState] = useState("");
  const [isFormValid, setIsFormValid] = useState(false); // New state for form validity
  const tabs = ["Cart", "Details", "Delivery"];
  const [discount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryResult, setDeliveryResult] = useState(null);
  const [restrauntAddress, setRestrauntAddress] = useState(null);
  const [validationSuccess, setValidationSuccess] = useState(true);
  const [isDeliveryAvailable, setIsDeliveryAvailable] = useState(true);

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

  // const handleQuantityChange = async (id, value) => {
  //   const updatedItems = items.map(async (item) => {
  //     if (item.id === id) {
  //       const newQuantity = Math.max(1, Number(value) || 1);
  //       const{status} = await updateCartItemQuantity(id, newQuantity);
  //       if(!status) return;
  //       const newTotalPrice = parseFloat(item.itemRegPrice) * newQuantity;
  //       return {
  //         ...item,
  //         quantity: newQuantity,
  //         totalPrice: newTotalPrice,
  //       };
  //     }
  //     return item;
  //   });
  //   setItems(updatedItems);
  //   setSubtotal(calculateSubtotal(updatedItems, deliveryCharge));

  //   const itemsForStorage = updatedItems.map((item) => ({
  //     id: item.id,
  //     itemId: item.itemId,
  //     itemName: item.itemName,
  //     itemRegPrice: item.itemRegPrice.toString(),
  //     imageURL: item.imageURL,
  //     quantity: item.quantity,
  //     totalPrice: item.totalPrice,
  //     note: item.note,
  //   }));
  //   localStorage.setItem("cartItems", JSON.stringify(itemsForStorage));
  // };

  //   const handleQuantityChange = async (id, rawValue) => {
  //   // 1) compute the desired new quantity
  //   const newQuantity = Math.max(1, Number(rawValue) || 1);

  //   // 2) hit the API to update it server-side
  //   try {
  //     const { status } = await updateCartItemQuantity(id, newQuantity);
  //     if (!status) {
  //       console.error("Server refused quantity update");
  //       return;
  //     }
  //   } catch (err) {
  //     console.error("Failed to update quantity:", err);
  //     return;
  //   }

  //   // 3) build a fresh copy of your items array, with the one item updated
  //   const updated = items.map(item => {
  //     if (item.id !== id) return item;
  //     const unit = parseFloat(item.itemRegPrice) || 0;
  //     return {
  //       ...item,
  //       quantity: newQuantity,
  //       totalPrice: unit * newQuantity,
  //     };
  //   });

  //   // 4) push it into context
  //   setItems(updated);

  //   // 5) persist to localStorage if you need
  //   localStorage.setItem(
  //     "cartItems",
  //     JSON.stringify(
  //       updated.map(i => ({
  //         ...i,
  //         itemRegPrice: i.itemRegPrice.toString(),
  //         // keep whatever you need in storage
  //       }))
  //     )
  //   );
  // };

  const handleQuantityChange = async (id, qty) => {
    await updateCartItemQuantity(id, qty);
    setItems((current) =>
      current.map((item) =>
        item.id !== id
          ? item
          : { ...item, quantity: qty, totalPrice: item.itemRegPrice * qty }
      )
    );
  };

  const handleDelete = async (item) => {
    try {
      // 1) Tell the server to delete that line-item
      const res = await deleteCartItem(item.id);
      // 2) Remove it from your local `items` state
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      if (!res.status) {
        removeItemLocal(item.itemId);
      }
      // (optional) also clear it out of orderData if you track that separately
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
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
      itemRegPrice: item.itemRegPrice.toString(),
      imageURL: item.imageURL,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
      note: item.note,
    }));
    localStorage.setItem("cartItems", JSON.stringify(itemsForStorage));
  };

  // const handleDelete = (id) => {
  //   toggleCart();
  //   const updatedItems = items.filter((item) => item.id !== id);
  //   setItems(updatedItems);
  //   setSubtotal(calculateSubtotal(updatedItems, deliveryCharge));

  //   const itemsForStorage = updatedItems.map((item) => ({
  //     id: item.id,
  //     itemId: item.itemId,
  //     itemName: item.itemName,
  //     itemRegPrice: item.itemRegPrice.toString(),
  //     imageURL: item.imageURL,
  //     quantity: item.quantity,
  //     totalPrice: item.totalPrice,
  //     note: item.note,
  //   }));
  //   localStorage.setItem("cartItems", JSON.stringify(itemsForStorage));
  // };

  // const handleNext = async () => {
  //   if (activeTab === "Cart") {
  //     const token = localStorage.getItem("aftoAuthToken");
  //     if (!token) {
  //       setLoginPage(true);
  //       return;
  //     }
  //     setActiveTab("Details");
  //   } else if (activeTab === "Details" && isFormValid) {
  //     // fetchDeliveryDetails();

  //     // getTemplates(businessAccountId).then((response) => {
  //     //   // console.log("Templates fetched successfully:", response);
  //     //   // console.log(response.businessData.address)
  //     //   // setRestrauntAddress(response.businessData.address);
  //     //   setRestrauntAddress(
  //     //     "2275 Britannia Rd W unit 15, Mississauga, ON L5M 2G6, Canada"
  //     //   );
  //     // });

  //     // const response = await getTemplates(businessAccountId);
  //     // const res = await calculateDeliveryCharge(
  //     //   response.businessData.address,
  //     //   address + " " + city + " " + state + " " + pincode
  //     // );
  //     const res = await calculateDeliveryCharge(
  //       restrauntAddress,
  //       address + " " + city + " " + state + " " + pincode
  //     );
  //     console.log("Restaurant Address:", restrauntAddress);
  //     console.log("Customer Address:", address, city, pincode, state);

  //     // const res = await calculateDeliveryCharge(restrauntAddress, address);
  //     setDeliveryResult(res);
  //     setDeliveryCharge(res.delivery_charge || 0);
  //     // console.log("Delivery Result:", res);
  //     setActiveTab("Delivery");
  //   } else if (activeTab === "Delivery" && isFormValid) {
  //     // Only proceed if form is valid
  //     // Update customer details

  //     // change the place order here
  //     setCustomerName(name);
  //     setCustomerWhatsappNumber(phone);

  //     // Construct orderData with user-provided values only
  //     const updatedOrderData = {
  //       customerName: name,
  //       customerWhatsappNumber: phone,
  //       customerEmail: email,
  //       businessAccountId: businessId,
  //       deliveryCharges: deliveryCharge,
  //       deliveryType: "delivery",
  //       items: items.map((item, index) => ({
  //         id: item.id,
  //         sectionTitle: "Rice", // Adjust as needed
  //         itemId: item.itemId,
  //         itemName: item.itemName,
  //         itemDescription: `${item.itemName}.`,
  //         itemRegPrice: item.itemRegPrice.toString(),
  //         salePrice: "0",
  //         imageURL: item.imageURL,
  //         serial_number: index + 1,
  //         productTemplateSectionId: "20903f70-bc7a-48f0-89fc-07bbede56cf1",
  //         isHSTApplied: false,
  //         HSTPercentage: "13.00",
  //         inventoryId: null,
  //         inventoryName: null,
  //         isSyncToInventory: false,
  //         createdAt: "2025-04-18T14:23:31.222Z",
  //         updatedAt: "2025-04-18T14:23:31.222Z",
  //         quantity: item.quantity,
  //       })),
  //     };

  //     setOrderData(updatedOrderData);
  //     console.log("Updated orderData:", updatedOrderData);

  //     // Place the order
  //     setIsLoading(true);
  //     try {
  //       const response = await placeOrder(updatedOrderData);
  //       let orderHistory = JSON.parse(
  //         localStorage.getItem("orderHistory") || "[]"
  //       );
  //       orderHistory.push(response.data);
  //       localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
  //       // localStorage.setItem("cartItems", JSON.stringify([]));
  //       // setItems([]); // Clear items in state
  //       setShowPayment(true);
  //       setPaymentDetails(response.data.paymentIntent);
  //       console.log(showPayment, "showPayment", response.data.paymentIntent);
  //       toggleCart();
  //     } catch (error) {
  //       console.error("Failed to place order:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  // };

  const handleNext = async () => {
    if (activeTab === "Cart") {
      const token = localStorage.getItem("aftoAuthToken");
      if (!token) {
        setLoginPage(true);
        return;
      }
      setActiveTab("Details");
    } else if (activeTab === "Details" && isFormValid && validationSuccess) {
      const res = await calculateDeliveryCharge(
        restrauntAddress,
        `${address} ${city} ${state} ${pincode}`
      );
      setDeliveryResult(res);
      setDeliveryCharge(res.delivery_charge || 0);
      setActiveTab("Delivery");
    } else if (activeTab === "Delivery" && isFormValid) {
      // 1) Get saved user data and orderId
      const signup = JSON.parse(localStorage.getItem("aftoSignupForm") || "{}");
      const orderId = localStorage.getItem("cartOrderId");
      if (!orderId) {
        console.error("No orderId in storage!");
        return;
      }

      // 2) Build payload from storage + state
      const payload = {
        customerName: signup.name || signup.customerName || "",
        customerWhatsappNumber: signup.phoneNo || "",
        customerEmail: signup.email || signup.customerEmail || "",
        businessAccountId: businessId,
        deliveryCharges: deliveryCharge,
        deliveryType: "delivery",
      };

      // 3) Call confirmOrder instead of placeOrder
      setIsLoading(true);
      try {
        const data = await confirmOrder(orderId, payload);

        // 4) mirror your existing post‐confirm behavior
        // let history = JSON.parse(localStorage.getItem("orderHistory") || "[]");
        // history.push(data);
        // localStorage.setItem("orderHistory", JSON.stringify(history));

        setShowPayment(true);
        setActiveTab("Cart");
        console.log("Payment Data: ", data.data.paymentIntent);
        setPaymentDetails(data.data.paymentIntent);

        // optional: clear your cart
        // localStorage.removeItem("cartItems");
        // localStorage.removeItem("cartOrderId");
        // setItems([]);
        toggleCart();
      } catch (err) {
        console.error("Failed to confirm order:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const isTabDisabled = (tab) => {
    if (activeTab === "Cart") {
      return tab !== "Cart";
    } else if (activeTab === "Details") {
      return tab === "Delivery" ? true : false;
    }
    return false;
  };

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");

  // ─── HYDRATE FROM STORAGE ──────────────────────────────────────────
  // const saved = JSON.parse(localStorage.getItem("aftoSignupForm") || "{}");
  // const [name, setName] = useState(saved.name || "");
  // const [phone, setPhone] = useState((saved.phone || "").slice(-10));
  // const [email, setEmail] = useState(saved.email || "");
  // const [address, setAddress] = useState(saved.address || "");
  // const [city, setCity] = useState(saved.city || "");
  // const [pincode, setPincode] = useState(saved.pincode || "");
  // const [state, setState] = useState(saved.state || "");
  // const [touched, setTouched] = useState({
  //   name: false,
  //   phone: false,
  //   email: false,
  //   address: false,
  //   city: false,
  //   pincode: false,
  //   state: false,
  // });

  // … all your other state hooks …

  // ─── PERSIST ON ANY CHANGE ────────────────────────────────────────
  // useEffect(() => {
  //   const form = { name, phone, email, address, city, pincode, state };
  //   // localStorage.setItem("aftoSignupForm", JSON.stringify(form));
  // }, [name, phone, email, address, city, pincode, state]);

  // useEffect(() => {
  //   if (savedSignupForm) {
  //     const data = JSON.parse(savedSignupForm);

  //     setName(data.name || "");
  //     setPhoneNumber((data.phoneNo || "").slice(-10)); // take only last 10 characters
  //     setEmail(data.email || "");
  //     setAddress(data.address || "");
  //     setCity(data.city || "");
  //     setPincode(data.pincode || data.postalCode || "");
  //     setState(data.province_or_territory || data.state || "");
  //     setTouched({
  //       name: !!data.name,
  //       phone: !!data.phoneNo,
  //       email: !!data.email,
  //       address: !!data.address,
  //       city: !!data.city,
  //       pincode: !!(data.pincode || data.postalCode),
  //       state: !!data.province_or_territory,
  //     });
  //   }
  // }, []);

  return {
    user,
    login,
    logout,
    theme,
    toggleTheme,
    toggleCart,
    isCartChanged,
    businessId,
    setBusinessId,
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
    handleSearch,
    closePopup,
    isCartOpen,
    setIsCartOpen,
    showFlyerTemplate,
    setShowFlyerTemplate,
    flyerTemplateId,
    setFlyerTemplateId,
    showAlert,
    setShowAlert,
    addItemLocal,
    removeItemLocal,
    // populateItems
    validationSuccess,
    setValidationSuccess,
    refreshItemLocal,
    isDeliveryAvailable,
    setIsDeliveryAvailable,
  };
};

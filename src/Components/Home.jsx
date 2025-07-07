import React, { useContext, useEffect, useState } from "react";
import { NavBar } from "./NavBar";
import { Body } from "./Body";
import { AppContext } from "../Service/Context/AppContext";

export const Home = ({ businessId }) => {
  const { activeIndex, setActiveIndex, isMobile } = useContext(AppContext);

  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVH();
    window.addEventListener("resize", setVH);
    return () => window.removeEventListener("resize", setVH);
  }, []);

  return (
    <div
      style={{ height: "calc(var(--vh, 1vh) * 100)" }}
      className={`
        h-full w-full flex 
        ${isMobile ? 'flex-col' : 'flex-row'}
        overflow-hidden
      `}
    >
      <NavBar activeIndex={activeIndex} setActiveIndex={setActiveIndex} />

      <div className={`
        flex-1 text-white 
        ${isMobile ? 'pb-16' : 'ml-0'}
        overflow-auto
      `}>
        <Body businessId={businessId} activeIndex={activeIndex} />
      </div>
    </div>
  );
};

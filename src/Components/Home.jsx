import React, { useContext, useEffect, useState } from "react";
import { NavBar } from "./NavBar";
import { Body } from "./Body";
import { AppContext } from "../Service/Context/AppContext";

export const Home = ({businessId}) => {
  const { activeIndex, setActiveIndex } = useContext(AppContext);

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
      className="h-full w-full flex sm:flex-row flex-col-reverse"
    >
      <div className="sm:w-[5%] sm:h-full">
        <NavBar setActiveIndex={setActiveIndex} activeIndex={activeIndex} />
      </div>
      <div className="flex-1 bg-w text-white">
        <Body businessId={businessId} activeIndex={activeIndex} />
      </div>
    </div>
  );
};

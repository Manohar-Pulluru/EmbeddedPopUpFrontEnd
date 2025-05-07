import React from "react";
import { ItemCard } from "./ItemCard";

export const Section = ({
  section,
  showPayment,
  handleAddToCart,
  itemLoading,
  itemAdded,
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-semibold text-white mb-4">{section.sectionTitle}</h2>
      <div
        style={{ transition: "all ease-in-out 1s" }}
        className="w-full flex flex-wrap gap-x-[5%] gap-y-[10%]"
      >
        {section.items.length > 0 ? (
          section.items.map((item, itemIndex) => (
            <ItemCard
              key={itemIndex}
              item={item}
              showPayment={showPayment}
              handleAddToCart={handleAddToCart}
              itemLoading={itemLoading}
              itemAdded={itemAdded}
            />
          ))
        ) : (
          <div className="w-full text-center text-xl text-[#ffffffaf]">
            No items in this section
          </div>
        )}
      </div>
    </div>
  );
};
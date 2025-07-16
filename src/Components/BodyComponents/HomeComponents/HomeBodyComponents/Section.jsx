// Section.js
import React, { useContext, useEffect, Suspense } from "react";
const ItemCard = React.lazy(() => import("./ItemCard"));
import { AppContext } from "../../../../Service/Context/AppContext";
export const Section = ({ section }) => {
  const {
    showPayment,
    handleAddToCart,
    itemLoading,
    itemAdded,
    refreshItemLocal,
  } = useContext(AppContext);
  // useEffect(() => {
  //   refreshItemLocal();
  // }, [refreshItemLocal]);

  const CardSkeleton = () => (
    <div
      className={`
        h-[150px] xs:h-[220px] sm:h-[250px] md:h-[280px]
        w-full aspect-[3/4]
        mt-8 xs:mt-10 sm:mt-12 md:mt-16 lg:mt-20
        bg-[#1F1D2B]
        relative rounded-2xl sm:rounded-3xl
        flex flex-col justify-end
        p-4 sm:p-5 md:p-6
        shadow-lg border border-gray-800
        animate-pulse
      `}
    />
  );

  return (
    <section className="mb-8 sm:mb-12 px-4 sm:px-6">
      {/* Section header with improved typography */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-2 sm:mb-3">
          {section.sectionTitle}
        </h2>
        {section.sectionDescription && (
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl">
            {section.sectionDescription}
          </p>
        )}
      </div>
      <div
        className="grid gap-8 mt-12 sm:mt-4 sm:gap-4 md:gap-6 lg:gap-8
          transition-all duration-300 ease-in-out
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-5
        "
      >
        {section?.items?.length > 0 ? (
          section.items.map((item, itemIndex) => (
            <Suspense key={item.id || itemIndex} fallback={<CardSkeleton />}>
              <ItemCard
                item={item}
                showPayment={showPayment}
                handleAddToCart={handleAddToCart}
                itemLoading={itemLoading}
                itemAdded={itemAdded}
              />
            </Suspense>
          ))
        ) : (
          <div className="col-span-full">
            <div className="text-center py-12 sm:py-16 lg:py-20">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 rounded-full bg-gray-800/50 flex items-center justify-center">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M11 9h2V7h-2m1 13c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m-1 15h2v-6h-2v6z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl text-gray-300 font-semibold mb-2 sm:mb-3">
                No items available
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-gray-500 max-w-md mx-auto">
                This section doesn't have any items yet. Check back later for
                new additions!
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {

  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  return (

    <section className="relative my-6 py-6 
    bg-linear-to-b from-[#fffaf4] via-[#fff1e6] to-[#fde68a] 
    rounded-2xl shadow-sm">

      {/* soft background glow */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 
      w-100 h-100 bg-orange-200 opacity-20 blur-3xl rounded-full"></div>

      {/* Title */}
      <div className="relative text-center py-3 text-3xl">

        <Title text1={"LATEST"} text2={"COLLECTION"} />

        {/* decorative divider */}
        <div className="flex justify-center items-center gap-3 mt-2 mb-3">
          <div className="w-12 h-0.5 bg-linear-to-r from-transparent via-blue-500 to-transparent"></div>
          <span className="text-blue-500 text-sm">✦</span>
          <div className="w-12 h-0.5 bg-linear-to-r from-transparent via-blue-500 to-transparent"></div>
        </div>

      </div>

      {/* Product Grid */}
      <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-4">

        {latestProducts.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            image={item.image}
            price={item.price}
          />
        ))}

      </div>

    </section>
  );
};

export default LatestCollection;
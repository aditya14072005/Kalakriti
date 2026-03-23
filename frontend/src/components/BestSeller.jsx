import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const BestSeller = () => {

  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const bestProducts = products.filter((item) => item.bestseller);
    setBestSeller(bestProducts.slice(0, 5));
  }, [products]);

  return (

    <section className="relative my-16 py-14 
    bg-linear-to-b from-[#fff7ed] via-[#fff1e6] to-[#fde68a] 
    rounded-2xl shadow-sm">

      {/* glow background */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 
      w-87.5 h-87.5 bg-orange-200 opacity-20 blur-3xl rounded-full"></div>

      {/* Title Section */}
      <div className="relative text-center py-6 text-3xl">

        <Title text1={"BEST"} text2={"SELLERS"} />

        {/* decorative divider */}
        <div className="flex justify-center items-center gap-4 mt-4 mb-6">
          <div className="w-16 h-0.5 bg-linear-to-r from-transparent via-orange-500 to-transparent"></div>
          <span className="text-orange-500 text-xl">✦</span>
          <div className="w-16 h-0.5 bg-linear-to-r from-transparent via-orange-500 to-transparent"></div>
        </div>

        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
          Discover our most loved products crafted with style and tradition.
        </p>

      </div>

      {/* Product Grid */}
      <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-4">

        {bestSeller.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            image={item.image}
            price={item.price}
            name={item.name}
          />
        ))}

      </div>

    </section>
  );
};

export default BestSeller;
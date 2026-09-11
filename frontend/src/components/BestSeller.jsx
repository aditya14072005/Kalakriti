import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import axios from "axios";

const BestSeller = () => {

  const { backendUrl } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    axios.get(`${backendUrl}/api/bestsellers`)
      .then(res => res.data.success && setBestSeller(res.data.products))
      .catch(() => {});
  }, [backendUrl]);

  return (

    <section className="relative my-6 py-6 
    bg-linear-to-b from-[#fff7ed] via-[#fff1e6] to-[#fde68a] 
    rounded-2xl shadow-sm">

      {/* glow background */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 
      w-87.5 h-87.5 bg-orange-200 opacity-20 blur-3xl rounded-full"></div>

      {/* Title Section */}
      <div className="relative text-center py-3 text-3xl">

        <Title text1={"BEST"} text2={"SELLERS"} />

        {/* decorative divider */}
        <div className="flex justify-center items-center gap-3 mt-2 mb-3">
          <div className="w-12 h-0.5 bg-linear-to-r from-transparent via-orange-500 to-transparent"></div>
          <span className="text-orange-500 text-sm">✦</span>
          <div className="w-12 h-0.5 bg-linear-to-r from-transparent via-orange-500 to-transparent"></div>
        </div>

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
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import axios from "axios";

const BestSeller = ({ limit }) => {
  const { backendUrl } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${backendUrl}/api/bestsellers`)
      .then(res => res.data.success && setBestSeller(res.data.products))
      .catch(() => {});
  }, [backendUrl]);

  const displayed = limit ? bestSeller.slice(0, limit) : bestSeller;
  const showMore = limit && bestSeller.length > limit;

  return (
    <section className="relative my-6 py-6 
    bg-linear-to-b from-[#fff7ed] via-[#fff1e6] to-[#fde68a] 
    rounded-2xl shadow-sm">

      <div className="absolute top-6 left-1/2 -translate-x-1/2 
      w-87.5 h-87.5 bg-orange-200 opacity-20 blur-3xl rounded-full"></div>

      <div className="relative text-center py-3 text-3xl">
        <Title text1={"BEST"} text2={"SELLERS"} />
        <div className="flex justify-center items-center gap-3 mt-2 mb-3">
          <div className="w-12 h-0.5 bg-linear-to-r from-transparent via-orange-500 to-transparent"></div>
          <span className="text-orange-500 text-sm">✦</span>
          <div className="w-12 h-0.5 bg-linear-to-r from-transparent via-orange-500 to-transparent"></div>
        </div>
      </div>

      <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-4">
        {displayed.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            image={item.image}
            price={item.price}
            name={item.name}
          />
        ))}
        {showMore && (
          <div className="flex items-center justify-center">
            <button
              onClick={() => navigate("/bestsellers")}
              className="w-full h-full min-h-40 flex flex-col items-center justify-center gap-2 
              border-2 border-dashed border-orange-300 rounded-xl text-orange-500 
              hover:bg-orange-50 hover:border-orange-500 transition-all duration-200"
            >
              <span className="text-3xl">→</span>
              <span className="text-sm font-medium">View All</span>
              <span className="text-xs text-orange-400">{bestSeller.length} items</span>
            </button>
          </div>
        )}
      </div>

    </section>
  );
};

export default BestSeller;

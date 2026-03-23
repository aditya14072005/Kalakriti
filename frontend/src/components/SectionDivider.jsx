import React from "react";

const SectionDivider = () => {
  return (
    <div className="flex items-center justify-center my-16">

      <div className="flex-1 h-0.5 bg-linear-to-r from-transparent via-orange-400 to-transparent"></div>

      <div className="mx-6 text-orange-500 text-2xl">
        ✦
      </div>

      <div className="flex-1 h-0.5 bg-linear-to-r from-transparent via-orange-400 to-transparent"></div>

    </div>
  );
};

export default SectionDivider;
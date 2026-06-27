import React from "react";

const Spinner = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-[#00726B] rounded-full animate-spin" />
    </div>
  );
};

export default Spinner;

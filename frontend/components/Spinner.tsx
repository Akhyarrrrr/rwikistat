import React from "react";
import Image from "next/image";
import Loader from "./spinner.gif";

const Spinner = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Image src={Loader} alt="loading..." />
    </div>
  );
};

export default Spinner;

"use client";

import Image from "next/image";
import Typed from "typed.js";
import React from "react";
import mipa from "@/public/mipa.jpeg";

export default function Hero() {
  const el = React.useRef(null);

  React.useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ["Lebih Mudah", "Lebih Seru", "Lebih Interaktif"],
      typeSpeed: 100,
      backSpeed: 50,
      loop: true,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <section className="relative scroll-smooth bg-white">
      <div
        className="  absolute left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none -z-1 box-border"
        aria-hidden="true"
      >
        <div className="flex flex-col h-screen w-screen sm:h-fit opacity-25">
          <Image className="" src={mipa} alt={""} />
        </div>
      </div>

      <div className="w-full mx-auto px-4 sm:px-6">
        {/* Hero content */}
        <div className="pt-32 pb-12 md:pt-40 md:pb-20 h-screen">
          {/* Section header */}
          <div className="text-center pb-12 md:pb-16">
            <h1
              className="bg-gradient-to-t from-[#00726B] to-[#38B68D] text-transparent bg-clip-text p-2  text-5xl md:text-7xl lg:text-8xl font-semibold leading-tighter tracking-tighter mb-4 md:mt-16 pb-4"
              data-aos="zoom-y-out"
            >
              Belajar <span className="font-extrabold">Statistika </span>
              <span ref={el}></span> <br /> Menggunakan{" "}
              <span className="font-extrabold"> Rwikistat</span>
            </h1>
            <div className="max-w-4xl mx-auto">
              <p
                className="text-xl text-gray-600 mb-8"
                data-aos="zoom-y-out"
                data-aos-delay="150"
              >
                Dapatkan Modul yang Mudah Dipahami dan Praktik Secara Langsung!
              </p>
              <div
                className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center"
                data-aos="zoom-y-out"
                data-aos-delay="300"
              >
                <a
                  className="py-3 px-5 rounded-md text-white hover:bg-[#225754] shadow-md font-s bg-[#00726B] w-full mb-4 sm:w-auto sm:mb-0"
                  href="/signin"
                >
                  Belajar Sekarang
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

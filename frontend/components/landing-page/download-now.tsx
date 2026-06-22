"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { RiRobot2Fill } from "react-icons/ri";
import { IoLogoAndroid } from "react-icons/io";
import { FaApple } from "react-icons/fa";

export default function Features() {
  const [tab, setTab] = useState<number>(1);

  const tabs = useRef<HTMLDivElement>(null);

  const heightFix = () => {
    if (tabs.current && tabs.current.parentElement)
      tabs.current.parentElement.style.height = `${tabs.current.clientHeight}px`;
  };

  useEffect(() => {
    heightFix();
  }, []);

  return (
    <section className="relative my-32 bg-white">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-12 md:pt-20">
          <div
            className=" bg-gradient-to-t from-[#00726B] to-[#38B68D] rounded-3xl text-white"
            aria-hidden="true"
            data-aos="fade-right"
            data-aos-offset="300"
            data-aos-easing="ease-in-sine"
          >
            <div className="px-5 py-10 md:px-16 md:py-20">
              <div className="flex flex-col justify-between p-4 leading-normal items-center">
                <h5 className=" text-3xl md:text-5xl font-semibold text-center">
                  Belajar dan Akses Cepat Darimana Saja
                </h5>
                <p className="mt-2 text-center text-lg">
                  Tetap terkini dan dorong belajar anda lebih giat dengan
                  Rwikistat di iOS & Android.
                </p>
                <p className="text-center text-lg">
                  Unduh aplikasinya hari ini.
                </p>
                <div className="flex flex-row mt-4 md:mt-10 gap-3">
                  <button className="flex flex-row justify-center items-center gap-2 py-3 px-5 rounded-lg text-[#00726B] font-semibold bg-white ml-3 transition duration-300 transform hover:shadow-lg hover:scale-105">
                    <IoLogoAndroid
                      color="#00726B"
                      size="30px"
                      className="items-center justify-center"
                    />
                    Unduh Sekarang
                  </button>
                  <button
                    className="flex flex-row justify-center items-center gap-2 py-3 px-5 rounded-lg text-[#00726B] font-semibold bg-white ml-3 transition duration-300 transform hover:shadow-lg hover:scale-105"
                    onClick={() =>
                      window.open(
                        "https://apps.apple.com/id/app/rwikistat/id6739125153",
                        "_blank"
                      )
                    }
                  >
                    <FaApple
                      color="#00726B"
                      size="30px"
                      className="items-center justify-center"
                    />
                    Unduh Sekarang
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

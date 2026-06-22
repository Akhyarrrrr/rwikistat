"use client";

import { FaLaptopCode, FaBookOpen } from "react-icons/fa6";
import { IoMdChatboxes } from "react-icons/io";
import { RiRobot2Fill } from "react-icons/ri";

import { useState, useRef, useEffect } from "react";

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
    <section className="relative bg-white my-14">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-12 md:pt-20">
          {/* Section header */}
          <div className="md:flex max-w-4xl mx-auto text-center md:text-left pb-5 md:pb-10">
            <h1 className="h2 text-2xl md:text-5xl font-bold mb-4 text-[#00726B]">
              Fitur Aplikasi RWikiStat
            </h1>
            <p className=" text-sm md:text-base text-gray-600 mt-2">
              Kami menawarkan 4 fitur unggulan umtuk pemgalaman pembelajaran
              anda dalam aplikasi Rwikistat!
            </p>
          </div>

          {/* Section content */}
          <div
            className=" bg-gradient-to-t from-[#00726B] to-[#38B68D] rounded-xl text-white"
            aria-hidden="true"
          >
            <div className=" md:py-12 md:px-20 max-w-sm mx-auto grid gap-4 md:grid-cols-2 lg:grid-cols-2 items-start  md:max-w-2xl lg:max-w-none">
              <div
                className="flex flex-col items-start  md:flex-row md:max-w-md px-3 py-5 "
                data-aos="fade-right"
                data-aos-offset="300"
                data-aos-easing="ease-in-sine"
              >
                <div className="bg-white p-3 rounded-lg mt-5">
                  <FaLaptopCode
                    color="#00726B"
                    size="30px"
                    className="items-center justify-center"
                  />
                </div>
                <div className="flex flex-col justify-between p-4 leading-normal">
                  <h5 className="mb-2 text-xl font-bold tracking-tight  ">
                    R Compiler
                  </h5>
                  <p className="mb-3 font-normal  ">
                    Coba sendiri dan bangun logika pemrograman kode R hingga
                    kamu paham!
                  </p>
                </div>
              </div>

              <div
                className="flex flex-col items-start  md:flex-row md:max-w-md px-3 py-5 "
                data-aos="fade-right"
                data-aos-offset="300"
                data-aos-easing="ease-in-sine"
              >
                <div className="bg-white p-3 rounded-lg mt-5">
                  <FaBookOpen
                    color="#00726B"
                    size="30px"
                    className="items-center justify-center"
                  />
                </div>
                <div className="flex flex-col justify-between p-4 leading-normal">
                  <h5 className="mb-2 text-xl font-bold tracking-tight ">
                    Modul Pembelajaran Interaktif
                  </h5>
                  <p className="mb-3 font-normal  ">
                    Baca, pahami dan eksekusi berbagai contoh yang akan membuat
                    kamu mudah memahami modul
                  </p>
                </div>
              </div>

              <div
                className="flex flex-col items-start  md:flex-row md:max-w-md px-3 py-5 "
                data-aos="fade-right"
                data-aos-offset="300"
                data-aos-easing="ease-in-sine"
              >
                <div className="bg-white p-3 rounded-lg mt-5">
                  <IoMdChatboxes
                    color="#00726B"
                    size="30px"
                    className="items-center justify-center"
                  />
                </div>
                <div className="flex flex-col justify-between p-4 leading-normal">
                  <h5 className="mb-2 text-xl font-bold tracking-tight  ">
                    Forum Diskusi
                  </h5>
                  <p className="mb-3 font-normal  ">
                    Masih kurang paham? tanyakan kepada pengguna lain tentang
                    kebingunganmu
                  </p>
                </div>
              </div>

              <div
                className="flex flex-col items-start  md:flex-row md:max-w-md px-3 py-5 "
                data-aos="fade-right"
                data-aos-offset="300"
                data-aos-easing="ease-in-sine"
              >
                <div className="bg-white p-3 rounded-lg mt-5">
                  <RiRobot2Fill
                    color="#00726B"
                    size="30px"
                    className="items-center justify-center"
                  />
                </div>
                <div className="flex flex-col justify-between p-4 leading-normal">
                  <h5 className="mb-2 text-xl font-bold tracking-tight ">
                    AI Rwichat
                  </h5>
                  <p className="mb-3 font-normal  ">
                    Tanyakan kepada AI Rwichat supaya kamu dapat penecerahan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

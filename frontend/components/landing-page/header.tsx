"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import MobileMenu from "./mobile-menu";

export default function Header() {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // Detect scroll to show header only after scrolling down by 10px
  const scrollHandler = () => {
    setIsVisible(window.pageYOffset > 10);
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  return (
    <header
      className={`fixed w-full z-30 md:bg-opacity-90 transition duration-700 ease-in-out ${
        isVisible
          ? "bg-[#00726B] backdrop-blur-sm shadow-lg"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Site branding */}
          <div className="shrink-0 mr-4">
            <div className="bg-white p-1 rounded">
              <Image
                className="object-contain"
                src={"/logo-horizontal.png"}
                alt="Logo"
                width={128}
                height={40}
              />
            </div>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex md:grow">
            {/* Desktop sign in links */}
            <ul className="flex grow justify-end flex-wrap items-center">
              <li>
                <Link
                  href="/signin"
                  className="py-3 px-5 rounded text-[#00726B] font-semibold bg-white ml-3"
                >
                  <span>Belajar Sekarang</span>
                </Link>
              </li>
            </ul>
          </nav>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

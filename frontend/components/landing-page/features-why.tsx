import { IoLibrarySharp } from "react-icons/io5";
import { FaPeopleGroup, FaLightbulb, FaBoltLightning } from "react-icons/fa6";

export default function FeaturesBlocks() {
  return (
    <section className="relative bg-white">
      <div
        className="absolute inset-0 h-screen pointer-events-none md:mt-24 lg:mt-0 bg-protectorange-200"
        aria-hidden="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 1512 775"
          fill="none"
        >
          <path
            d="M-112 59.3717C59.8828 61.3647 465.166 59.3718 465.166 592.305C465.166 940.497 952.473 526.668 1165.37 230.373C1246.84 116.982 1456.35 -24.4945 1626 96.0433"
            stroke="url(#paint0_linear_170_7762)"
            strokeWidth="100"
            className="svg-elem-1"
          ></path>
          <defs>
            <linearGradient
              id="paint0_linear_170_7762"
              x1="757"
              y1="-253.55"
              x2="757"
              y2="815.366"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#00726B"></stop>
              <stop offset="1" stopColor="#00726B" stopOpacity="0"></stop>
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative max-w-6xl px-4 mx-auto mt-10 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="max-w-3xl pb-12 mx-auto text-center md:pb-20">
            <h2 className="text-4xl font-extrabold mb-4 text-[#00726B]">
              Kenapa Belajar Melalui Rwikistat?
            </h2>
            <p className="text-xl text-gray-600">
              Pada dasarnya Rwikistat mengedepankan kemudahan bagi penggunanya
            </p>
          </div>

          {/* Items */}
          <div
            className="grid items-start max-w-sm gap-6 mx-auto md:grid-cols-2 lg:grid-cols-4 md:max-w-2xl lg:max-w-none"
            data-aos="zoom-y-out"
            data-aos-delay="350"
          >
            {/* 1st */}
            <div className="relative flex flex-col items-center px-8 pt-12 pb-16 bg-white border rounded shadow-lg">
              <div className="w-16 h-16 p-1 -mt-1 mb-2 bg-[#00726B] rounded-full">
                <IoLibrarySharp
                  color="white"
                  size="30px"
                  className="items-center justify-center mt-3 ml-3"
                />
              </div>
              <h4 className="mb-1 text-xl font-bold leading-snug tracking-tight text-center">
                Adanya Library GetShinny
              </h4>
              <p className="text-sm text-center text-gray-600">
                Lebih mudah dalam percobaan dan eksplorasi.
              </p>
            </div>

            {/* 2nd */}
            <div className="relative flex flex-col items-center px-10 pt-12 pb-16 bg-white border rounded shadow-lg">
              <div className="w-16 h-16 p-1 -mt-1 mb-2 bg-[#00726B] rounded-full">
                <FaBoltLightning
                  color="white"
                  size="30px"
                  className="items-center justify-center mt-3 ml-3"
                />
              </div>
              <h4 className="mb-1 text-xl font-bold leading-snug tracking-tight text-center">
                Mudah Untuk Dicoba
              </h4>
              <p className="text-sm text-center text-gray-600">
                Masuk dengan akun anda dan coba fiturnya
              </p>
            </div>

            {/* 3rd */}
            <div className="relative flex flex-col items-center px-10 pt-12 pb-16 bg-white border rounded shadow-lg">
              <div className="w-16 h-16 p-1 -mt-1 mb-2 bg-[#00726B] rounded-full">
                <FaPeopleGroup
                  color="white"
                  size="30px"
                  className="items-center justify-center mt-3 ml-3"
                />
              </div>
              <h4 className="mb-1 text-xl font-bold leading-snug tracking-tight text-center">
                Forum Tempat Diskusi
              </h4>
              <p className="text-sm text-center text-gray-600">
                Berinteraksi dengan pengguna lainnya.
              </p>
            </div>

            {/* 4th */}
            <div className="relative flex flex-col items-center px-10 pt-12 pb-16 bg-white border rounded shadow-lg">
              <div className="w-16 h-16 p-1 -mt-1 mb-2 bg-[#00726B] rounded-full">
                <FaLightbulb
                  color="white"
                  size="30px"
                  className="items-center justify-center mt-3 ml-3"
                />
              </div>
              <h4 className="mb-1 text-xl font-bold leading-snug tracking-tight text-center">
                Belajar dan Langsung Coba
              </h4>
              <p className="text-sm text-center text-gray-600">
                Tiap modul memiliki latihan untuk di pelajari.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

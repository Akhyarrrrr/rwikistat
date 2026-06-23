"use client";
import React, { useState } from "react";
import { UserAuth } from "@/app/context/authContext";
import { generateCSRFToken } from "@/app/utils/csrf";

const LoginForm = () => {
  const { user, googleSignIn, emailSignIn } = UserAuth();
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const csrfToken: string = generateCSRFToken();

  const handleNimChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNim(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const email = `${nim}@example.com`;

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await emailSignIn(email, password);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-screen flex bg-[#00726B] ">
      <div
        className="absolute inset-0 h-screen md:mt-24 lg:mt-0 bg-protectorange-200 pointer-events-none font-poppins"
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
              <stop stopColor="#fff"></stop>
              <stop offset="1" stopColor="#fff" stopOpacity="0"></stop>
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex w-full lg:w-1/2 justify-center items-center mx-auto space-y-8 z-10">
        <div className="w-full px-8 md:px-32 lg:px-24 ">
          <div className="rounded-md shadow-2xl p-7 md:p-14 bg-white">
            <form onSubmit={handleEmailSignIn} className="text-center ">
              <h1 className="text-[#00726B] font-bold text-3xl md:text-5xl  ">
                Selamat Datang Statistikawan
              </h1>
              <p className="text-base md:text-xl font-light text-gray-400 mb-8">
                Halo 👋 ayo semangat belajar!
              </p>
              <div className="flex items-center border-2 mb-8 py-3 px-3 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
                <input type="hidden" name="_csrf" value={csrfToken} />
                <input
                  id="email"
                  name="nim"
                  autoComplete="nim"
                  placeholder="Masukan NIM/NIP"
                  onChange={handleNimChange}
                  value={nim}
                  className="pl-2 w-full outline-none border-none"
                />
              </div>
              <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  name="password"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukan Password"
                  autoComplete="off"
                  value={password}
                  onChange={handlePasswordChange}
                  className="pl-2 w-full outline-none border-none"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="focus:outline-none"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clipRule="evenodd"
                      />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <button
                type="submit"
                className="block w-full bg-[#00726B] mt-5 py-2 rounded-lg hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2"
              >
                Masuk
              </button>
              <p className="text-center my-7 font-light text-gray-400 ">
                Bukan Mahasiswa USK?
              </p>
            </form>
            <button
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center gap-2 text-gray-400 w-full bg-[#F1F6F7] mt-5 py-2 rounded-lg hover:-translate-y-1 transition-all duration-500 font-semibold mb-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 0 24 24"
                width="24"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Masuk dengan Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

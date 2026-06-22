module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    fontFamily: {
      poppins: ["poppins"],
      poppinsBold: ["poppinsBold"],
      poppinsSemiBold: ["poppinsSemiBold"],
      poppinsItalic: ["poppinsItalic"],
    },
    colors: {
      primary: "#00726B",
      secondary: "#38B68D",
      white: "#FBFBFB",
      black: "#000000",
      gray: "#A4A4A4",
      softgray: "#EFEFEF",
      red: "#FF5555",
    },
  },
  plugins: [],
};
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backdropFilter: ["hover"],
      transform: ["hover"],
      fontFamily: {
        neue: ["Bebas Neue", "cursive"],
      },
    },
  },
  plugins: [],
};

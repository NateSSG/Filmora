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
      colors: {
        primary: {
          DEFAULT: '#1E3A8A',
          light: '#3B82F6',
          dark: '#1E40AF',
        },
        secondary: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
        },
        accent: {
          DEFAULT: '#F59E0B',
          light: '#FBBF24',
          dark: '#D97706',
        },
        background: {
          DEFAULT: '#111827',
          light: '#1F2937',
          dark: '#030712',
        },
      },
    },
  },
  plugins: [],
};
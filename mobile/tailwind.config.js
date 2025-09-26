/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",     
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
       colors: {
        // Coffee
        coffee: {
          primary: "#8B593E",
          background: "#FFF8F3",
          text: "#4A3428",
          textLight: "#7D6A58",
          border: "#E5D3B7",
          card: "#FAF3EB",
          white: "#FFFFFF",
          expense: "#E74C3C",
          shadow: "#CAB9A3",
        },
        // Forest
        forest: {
          primary: "#2E7D32",
          background: "#E8F5E9",
          text: "#1B5E20",
          textLight: "#388E3C",
          border: "#A5D6A7",
          card: "#C8E6C9",
          white: "#FFFFFF",
          expense: "#C62828",
          shadow: "#81C784",
        },
        // Purple
        purpleTheme: {
          primary: "#6A1B9A",
          background: "#F3E5F5",
          text: "#4A148C",
          textLight: "#8E24AA",
          border: "#CE93D8",
          card: "#E1BEE7",
          white: "#FFFFFF",
          expense: "#D32F2F",
          shadow: "#BA68C8",
        },
        // Ocean
        ocean: {
          primary: "#0277BD",
          background: "#E1F5FE",
          text: "#01579B",
          textLight: "#0288D1",
          border: "#81D4FA",
          card: "#B3E5FC",
          white: "#FFFFFF",
          expense: "#EF5350",
          shadow: "#4FC3F7",
        },
    },
  },
  plugins: [],
}
}

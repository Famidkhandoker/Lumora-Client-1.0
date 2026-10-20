/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Soft pastel palette
        cream: "#FFF9D2",
        peach: "#FFEBCC",
        skysoft: "#BFDDF0",
        sky: "#8CC0EB",
        ink: "#1F3A52",
        inkmuted: "#5C7184",
        primarydeep: "#5B9BD5",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#8CC0EB",
          secondary: "#BFDDF0",
          accent: "#FFEBCC",
          neutral: "#F0F6FB",
          "base-100": "#FFFBF2",
          "base-200": "#F0F6FB",
          "base-300": "#E4EDF4",
          info: "#8CC0EB",
          success: "#7FB77E",
          warning: "#F2C078",
          error: "#E8806B",
        },
        dark: {
          primary: "#8CC0EB",
          secondary: "#BFDDF0",
          accent: "#FFEBCC",
          neutral: "#1B2A38",
          "base-100": "#14202C",
          "base-200": "#1B2A38",
          "base-300": "#26384A",
          info: "#8CC0EB",
          success: "#7FB77E",
          warning: "#F2C078",
          error: "#E8806B",
        },
      },
    ],
  },
}

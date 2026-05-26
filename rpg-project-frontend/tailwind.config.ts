import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        vaccineGray: {
            1000: "#2f2f2f",
            900: "#404040",
            800: "#505050",
            700: "#737373",
            600: "#adadad",
            500: "#cfcfcf",
            400: "#d9d9d9",
            300: "#e5e5e5",
            200: "#f2f2f2",
            100: "#f9f9f9",

        },
        vaccineRed: "#6f0000",
        vaccineBlack: "#000000",
        vaccineDarkBlue: "#010011",
        vaccineBlue: "#02001c",
      },
      fontFamily: {
        myFont: ["MyFont", "sans-serif"],
        vollkorn: ["Vollkorn", "serif"],
        lor: ["lor", "serif"],
        trajanPBold: ["trajanPBold", "serif"],
        trajanPRegular: ["trajanPRegular", "serif"],
        walthari: ["walthari", "serif"],
      },
      backgroundImage: {
        "infinite": "url('/imgs/infinite.jpeg')",
      },
    },
  },
} satisfies Config;


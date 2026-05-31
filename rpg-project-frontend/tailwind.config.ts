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
        // vaccineRed: {
        //   1000: "#6f0000",
        //   900: "#c40000",
        // },
        vaccineRed: "#c40000",
        vaccineBlack: "#000000",
        vaccineDarkBlue: "#010011",
        vaccineBlue: "#02001c",
        vaccineBlueTones: {
          1000: "#050233",
          950: "#090543",
          900: "#0c0759",
          850: "#100c4e",
          800: "#1c1764",
          700: "#140d72",
          600: "#1c1574",
          500: "#0b2494",
          400: "#1935b1",
          350: "#283779",
          300: "#4255a8",
          200: "#3349ab",
          100: "#5069db",
          
        },
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


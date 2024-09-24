import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "400px",
      },
      gridTemplateColumns: {
        "auto-fill": "repeat(auto-fill, minmax(18rem, 1fr))",
      },
      backgroundColor: {
        default: colors.slate[50],
      },
      colors: {
        nav: {
          background: colors.white,
          border: colors.slate[100],
          link: {
            default: colors.blue[950],
            hover: colors.blue[600],
          },
          banner: {
            background: colors.lime[50],
            icon: colors.lime[600],
            border: colors.lime[100],
            text: colors.lime[600],
          },
        },
        portal: {
          background: colors.blue[950],
        },
        text: colors.blue[950],
        button: {
          primary: {
            background: colors.blue[600],
            text: colors.white,
            icon: colors.white,
            hover: {
              background: colors.blue[700],
            },
          },
          secondary: {
            background: colors.white,
            text: colors.slate[950],
            icon: colors.slate[950],
            hover: {
              background: colors.blue[100],
            },
          },
          success: {
            background: colors.green[600],
            text: colors.white,
            icon: colors.white,
            hover: {
              background: colors.green[700],
            },
          },
          danger: {
            background: colors.red[600],
            text: colors.white,
            icon: colors.white,
            hover: {
              background: colors.red[700],
            },
          },
          disabled: {
            background: colors.blue[300],
            text: colors.white,
            icon: colors.white,
            hover: {
              background: colors.blue[300],
            },
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;

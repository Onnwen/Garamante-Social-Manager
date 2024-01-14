import type { Config } from "tailwindcss"
import colors from "tailwindcss/colors"

const config: Config = {
    content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        transparent: "transparent",
        current: "currentColor",
        extend: {
            colors: {
                // light mode
                tremor: {
                    brand: {
                        faint: "#F9BD9C", // <--- tremor-brand-faint, lighter shade of brand color
                        muted: colors.blue[200],
                        subtle: colors.blue[400],
                        DEFAULT: "#F99157", // <--- tremor-brand-DEFAULT, brand color
                        emphasis: colors.blue[700],
                        inverted: colors.white,
                    },
                    // ...
                },
            },
        },
    },
    plugins: [],
}
export default config

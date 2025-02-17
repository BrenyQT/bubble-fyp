/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    theme: {
        extend: {
            colors: {
                primary: "#315659",  // Main color
                secondary: "#022F40", // Darker shade
                accent: "#5FA8D3",  // Lighter shade
            },
        },
    },
    plugins: [],
};

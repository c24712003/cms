/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#2563eb', // Blue 600
                secondary: '#475569', // Slate 600
                danger: '#dc2626', // Red 600
                success: '#16a34a', // Green 600
                background: '#f8fafc', // Slate 50
                surface: '#ffffff',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}

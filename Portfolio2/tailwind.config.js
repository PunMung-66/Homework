/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./public/index.html', './src/**/*.{html,js,css}'],
    theme: {
        extend: {
            fontFamily: {
                pixel: ['Pixelify Sans', 'sans-serif'],
                jersey: ['"Jersey 10"', 'sans-serif'],
            },
            backgroundImage: {
                'radial-dark':
                    'radial-gradient(circle, rgba(85, 85, 85, 1), rgba(0, 0, 0, 1))',
            },
            backgroundColor: {
                'low-black': 'rgba(0, 0, 0, 0.5)',
                'modal-black': 'rgba(0, 0, 0, 0.95)',
                'low-white': 'rgba(246, 246, 246, 0.9)',
            },
            keyframes: {
                popup: {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                },
                close: {
                    '0%': { opacity: 1 },
                    '100%': { opacity: 0 },
                },
            },
            animation: {
                popup: 'popup 1s ease-in-out',
                close: 'close 1s ease-in-out',
            },
        },
        screens: {
            '2xl': { max: '30035px' },
            // => @media (max-width: 1535px) { ... }
            xl: { max: '1900px' },
            l: { max: '1100px' },
            md: { max: '1000px' },
            s: { max: '700px' },
            // => @media (max-width: 767px) { ... }
        },
    },
    plugins: [],
}

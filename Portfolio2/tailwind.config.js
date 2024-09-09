/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./public/index.html', './src/**/*.{html,js,css}'],
    theme: {
        extend: {},
        screens: {
            '2xl': { max: '1535px' },
            // => @media (max-width: 1535px) { ... }


            md: { max: '1000px' },
            // => @media (max-width: 767px) { ... }

        },
    },
    plugins: [],
}


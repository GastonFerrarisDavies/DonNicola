/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
            primary: '#6f1d1b',
            secondary: '#e63946',
            tertiary: '#fdf0d5',
            quaternary: '#1d3557',
            quinary: '#457b9d',
            background1: '#E2E2E2',
            background2: '#F8F8F8'
        },
      },
    },
    plugins: [],
  };
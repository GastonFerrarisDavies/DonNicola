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
            primario: '#000000',
            secundario: '#1a1a1a',
            terciario: '#2a2a2a',
            cuaternario: '#3a3a3a',
        },
      },
    },
    plugins: [],
  };
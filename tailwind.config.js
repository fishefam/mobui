/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/react/**/*.tsx', 'node_modules/flowbite-react/lib/esm/**/*.js'],
  darkMode: 'class',
  plugins: [require('flowbite/plugin')],
  theme: {
    extend: {},
  },
}

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
        '3a-black': 'hsl(var(--color-3a-black))',
        '3a-paper': 'hsl(var(--color-3a-paper))',
        '3a-red': 'hsl(var(--color-3a-red))',
        '3a-red-dark': 'hsl(var(--color-3a-red-dark))',
        '3a-blue': 'hsl(var(--color-3a-blue))',
        '3a-green': 'hsl(var(--color-3a-green))',
        '3a-gray-darkest': 'hsl(var(--color-3a-gray-darkest))',
        '3a-gray-darker': 'hsl(var(--color-3a-gray-darker))',
        '3a-gray': 'hsl(var(--color-3a-gray))',
        '3a-white': 'hsl(var(--color-3a-white))',
      }
  	}
  },
  plugins: [require("tailwindcss-animate")],
}


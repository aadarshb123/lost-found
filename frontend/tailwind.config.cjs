// tailwind.config.js
module.exports = {
  content: [
    // If you have an index.html at the root or in public, include it here:
    "./index.html",
    "./public/index.html",
    
    // Scan all files in src with these extensions:
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
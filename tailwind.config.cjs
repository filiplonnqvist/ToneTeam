/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/**/*.ejs',
    './public/**/*.js',
    './src/**/*.{js,ejs}'
  ],
  theme: {
    extend: {
      width: {
        piano: '520px'
      }
    }
  },
  plugins: []
}

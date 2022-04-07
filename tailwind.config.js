module.exports = {
  // content: ["./src/**/idea-creation.dialog.html",],
  theme: {
    extend: {},
  },
  purge: {
    enabled: true,
    content: [
      './src/**/*.{html,ts}',
    ]
  },
  plugins: [require('@tailwindcss/typography')],
}

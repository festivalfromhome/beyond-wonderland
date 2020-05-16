module.exports = {
  theme: {
    extend: {
      colors: {
        blue: "#12c2e9",
        purple: "#c471ed",
        orange: "#f64f59",
        gray: {
          light: "#edf2f7",
          default: "#4f575f",
          dark: "#1e2123",
        }
      }
    }
  },
  variants: {
    backgroundColor: ['responsive'],
    backgroundOpacity: ['hover'],
    boxShadow: ['focus-within', 'hover'],
    cursor: ['hover']
  },
  plugins: []
}

module.exports = {
  plugins: {
    'postcss-preset-mantine': {},
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xs': '430px',
        'mantine-breakpoint-sm': '540px',
        'mantine-breakpoint-md': '768px',
        'mantine-breakpoint-lg': '1024px',
        'mantine-breakpoint-xl': '1280px',
      },
    },
  },
};

const path = require('path');
const postcssCssnext = require('postcss-cssnext');

module.exports = {
  plugins: [
    postcssCssnext({
      overflowWrap: true,
      rem: false,
      colorRgba: false,
      autoprefixer: {
        browsers: ['> 1%', 'last 2 versions'],
      } }),
  ],
};

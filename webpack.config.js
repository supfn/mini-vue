const path = require('path');

module.exports = {
  entry: './src/MiniVue.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'mini-vue.js'
  }
};

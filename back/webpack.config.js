// FROM https://medium.com/@diegoreyes1212/how-to-deploy-phaser-3-node-js-express-webpack-game-to-heroku-tutorial-8a813f31502c

const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
    ],
  },
};
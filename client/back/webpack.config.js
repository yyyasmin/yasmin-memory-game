// FROM https://hackernoon.com/a-guide-to-deploying-phaser-3-webpack-games-to-heroku-k91u3tz6

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